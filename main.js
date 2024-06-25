// Constants
const STORAGE_KEY = 'BOOKSHELF_APP';
const bookForm = document.getElementById('bookForm');
const searchForm = document.getElementById('searchBook');
const incompleteBookList = document.getElementById('incompleteBookList');
const completeBookList = document.getElementById('completeBookList');

// Check for Storage Availability
function isStorageAvailable() {
  if (typeof(Storage) === 'undefined') {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

// Get Books from Local Storage
function getBooksFromStorage() {
  if (!isStorageAvailable()) return [];
  const books = localStorage.getItem(STORAGE_KEY);
  return books ? JSON.parse(books) : [];
}

// Save Books to Local Storage
function saveBooksToStorage(books) {
  if (!isStorageAvailable()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// Generate Unique ID
function generateId() {
  return +new Date();
}

// Create Book Object
function createBookObject(id, title, author, year, isComplete) {
  return { id, title, author, year, isComplete };
}

// Render Books
function renderBooks() {
  const books = getBooksFromStorage();
  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  books.forEach(book => {
    const bookElement = makeBookElement(book);
    if (book.isComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  });
}

// Create Book Element
function makeBookElement(book) {
    const bookTitle = document.createElement('h3');
    bookTitle.className = 'book-title';
    bookTitle.innerText = book.title;
  
    const bookAuthor = document.createElement('p');
    bookAuthor.className = 'book-author';
    bookAuthor.innerText = `Penulis: ${book.author}`;
  
    const bookYear = document.createElement('p');
    bookYear.className = 'book-year';
    bookYear.innerText = `Tahun: ${book.year}`;
  
    const bookAction = document.createElement('div');
    bookAction.className = 'book-action';
  
    const toggleButton = document.createElement('button');
    toggleButton.className = 'toggle-button';
    toggleButton.innerText = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
    toggleButton.addEventListener('click', () => toggleBookCompletion(book.id));
  
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.innerText = 'Hapus Buku';
    deleteButton.addEventListener('click', () => deleteBook(book.id));
  
    bookAction.append(toggleButton, deleteButton);
  
    const bookElement = document.createElement('div');
    bookElement.className = 'book-item';
    bookElement.setAttribute('data-bookid', book.id);
    bookElement.append(bookTitle, bookAuthor, bookYear, bookAction);
  
    return bookElement;
  }
  

// Add Book
function addBook(title, author, year, isComplete) {
  const books = getBooksFromStorage();
  const id = generateId();
  const book = createBookObject(id, title, author, year, isComplete);
  books.push(book);
  saveBooksToStorage(books);
  renderBooks();
}

// Toggle Book Completion
function toggleBookCompletion(bookId) {
  const books = getBooksFromStorage();
  const bookIndex = books.findIndex(book => book.id === bookId);
  if (bookIndex === -1) return;

  books[bookIndex].isComplete = !books[bookIndex].isComplete;
  saveBooksToStorage(books);
  renderBooks();
}

// Delete Book
function deleteBook(bookId) {
  const books = getBooksFromStorage();
  const filteredBooks = books.filter(book => book.id !== bookId);
  saveBooksToStorage(filteredBooks);
  renderBooks();
}

// Event Listeners
bookForm.addEventListener('submit', event => {
  event.preventDefault();
  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = document.getElementById('bookFormYear').value;
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  addBook(title, author, year, isComplete);

  bookForm.reset();
});

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
  const books = getBooksFromStorage();

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  books.forEach(book => {
    if (book.title.toLowerCase().includes(searchTitle)) {
      const bookElement = makeBookElement(book);
      if (book.isComplete) {
        completeBookList.append(bookElement);
      } else {
        incompleteBookList.append(bookElement);
      }
    }
  });
});

// Initial Render
document.addEventListener('DOMContentLoaded', renderBooks);
