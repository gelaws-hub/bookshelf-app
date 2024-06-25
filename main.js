// Constants
const STORAGE_KEY = "BOOKSHELF_APP";
const bookForm = document.getElementById("bookForm");
const searchForm = document.getElementById("searchBook");
const incompleteBookList = document.getElementById("incompleteBookList");
const completeBookList = document.getElementById("completeBookList");

// Check for Storage Availability
function isStorageAvailable() {
  if (typeof Storage === "undefined") {
    alert("Browser kamu tidak mendukung local storage");
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
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  books.forEach((book) => {
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
  const bookTitle = document.createElement("h3");
  bookTitle.className = "book-title";
  bookTitle.innerText = book.title;
  bookTitle.setAttribute("data-testid", "bookItemTitle");

  const bookAuthor = document.createElement("p");
  bookAuthor.className = "book-author";
  bookAuthor.innerText = `Penulis: ${book.author}`;
  bookAuthor.setAttribute("data-testid", "bookItemAuthor");

  const bookYear = document.createElement("p");
  bookYear.className = "book-year";
  bookYear.innerText = `Tahun: ${book.year}`;
  bookYear.setAttribute("data-testid", "bookItemYear");

  const bookAction = document.createElement("div");
  bookAction.className = "book-action";

  const toggleButton = document.createElement("button");
  toggleButton.className = "toggle-button";
  toggleButton.innerText = book.isComplete
    ? "Belum selesai dibaca"
    : "Selesai dibaca";
  toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");
  toggleButton.addEventListener("click", () => toggleBookCompletion(book.id));

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.innerText = "Hapus Buku";
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
  deleteButton.addEventListener("click", () => deleteBook(book.id));

  const editButton = document.createElement("button");
  editButton.className = "edit-button";
  editButton.innerText = "Edit Buku";
  editButton.setAttribute("data-testid", "bookItemEditButton");
  editButton.addEventListener("click", () => editBook(book.id));

  bookAction.append(toggleButton, deleteButton, editButton);

  const bookElement = document.createElement("div");
  bookElement.className = "book-item";
  bookElement.setAttribute("data-bookid", book.id);
  bookElement.setAttribute("data-testid", "bookItem");
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
  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex === -1) return;

  books[bookIndex].isComplete = !books[bookIndex].isComplete;
  saveBooksToStorage(books);
  renderBooks();
}

// Delete Book
function deleteBook(bookId) {
  const books = getBooksFromStorage();
  const filteredBooks = books.filter((book) => book.id !== bookId);
  saveBooksToStorage(filteredBooks);
  renderBooks();
}

// Event Listeners
bookForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  addBook(title, author, year, isComplete);

  bookForm.reset();
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const books = getBooksFromStorage();

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  books.forEach((book) => {
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

// Edit Buku
// Ambil elemen modal
const modal = document.getElementById("editModal");

// Ambil elemen tombol untuk menutup modal
const closeModalBtn = document.querySelector(".close");

// Ambil elemen form di dalam modal
const editForm = document.getElementById("editForm");
const editFormTitle = document.getElementById("editFormTitle");
const editFormAuthor = document.getElementById("editFormAuthor");
const editFormYear = document.getElementById("editFormYear");
const editFormIsComplete = document.getElementById("editFormIsComplete");

// Fungsi untuk menampilkan modal edit buku dengan nilai default
function editBook(bookId) {
  // Temukan buku berdasarkan bookId
  const bookElement = document.querySelector(`[data-bookid="${bookId}"]`);
  const bookTitleElement = bookElement.querySelector(
    '[data-testid="bookItemTitle"]'
  );
  const bookAuthorElement = bookElement.querySelector(
    '[data-testid="bookItemAuthor"]'
  );
  const bookYearElement = bookElement.querySelector(
    '[data-testid="bookItemYear"]'
  );
  const isCompleteElement = bookElement.querySelector(
    '[data-testid="bookItemIsCompleteButton"]'
  );

  const bookTitle = bookTitleElement.innerText;
  const bookAuthor = bookAuthorElement.innerText.replace("Penulis: ", "");
  const bookYear = bookYearElement.innerText.replace("Tahun: ", "");
  const isComplete = isCompleteElement.innerText === "Belum selesai dibaca";

  // Isi nilai default pada form edit
  editFormTitle.value = bookTitle;
  editFormAuthor.value = bookAuthor;
  editFormYear.value = bookYear;
  editFormIsComplete.checked = isComplete;

  // Tampilkan modal
  modal.style.display = "block";

  // Event listener untuk form edit buku
  editForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Ambil nilai dari form
    const editedBook = {
      id: bookId,
      title: editFormTitle.value,
      author: editFormAuthor.value,
      year: editFormYear.value,
      isComplete: editFormIsComplete.checked,
    };

    // Ambil semua buku dari localStorage
    const books = getBooksFromStorage();

    // Cari buku yang di-edit berdasarkan ID
    const editedBookIndex = books.findIndex((book) => book.id === bookId);

    // Update buku yang di-edit dengan nilai baru
    books[editedBookIndex] = editedBook;

    // Simpan kembali ke localStorage
    saveBooksToStorage(books);

    // Render ulang buku-buku setelah perubahan
    renderBooks();

    // Tutup modal setelah selesai edit
    modal.style.display = "none";
  });
}
// Fungsi untuk menampilkan modal edit buku dengan nilai default
function editBook(bookId) {
  // Temukan buku berdasarkan bookId
  const bookElement = document.querySelector(`[data-bookid="${bookId}"]`);
  const bookTitleElement = bookElement.querySelector(
    '[data-testid="bookItemTitle"]'
  );
  const bookAuthorElement = bookElement.querySelector(
    '[data-testid="bookItemAuthor"]'
  );
  const bookYearElement = bookElement.querySelector(
    '[data-testid="bookItemYear"]'
  );
  const isCompleteElement = bookElement.querySelector(
    '[data-testid="bookItemIsCompleteButton"]'
  );

  const bookTitle = bookTitleElement.innerText;
  const bookAuthor = bookAuthorElement.innerText.replace("Penulis: ", "");
  const bookYear = bookYearElement.innerText.replace("Tahun: ", "");
  const isComplete = isCompleteElement.innerText === "Belum selesai dibaca";

  // Isi nilai default pada form edit
  editFormTitle.value = bookTitle;
  editFormAuthor.value = bookAuthor;
  editFormYear.value = bookYear;
  editFormIsComplete.checked = isComplete;

  // Tampilkan modal
  modal.style.display = "block";

  // Event listener untuk form edit buku
  editForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Ambil nilai dari form
    const editedBook = {
      id: bookId,
      title: editFormTitle.value,
      author: editFormAuthor.value,
      year: editFormYear.value,
      isComplete: editFormIsComplete.checked,
    };

    const books = getBooksFromStorage();

    const editedBookIndex = books.findIndex((book) => book.id === bookId);

    books[editedBookIndex] = editedBook;

    saveBooksToStorage(books);

    renderBooks();

    modal.style.display = "none";
  });
}

closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

const cancelBtn = document.querySelector(".cancel-btn");
cancelBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

editForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const editedBook = {
    title: editFormTitle.value,
    author: editFormAuthor.value,
    year: editFormYear.value,
    isComplete: editFormIsComplete.checked,
  };

  console.log("Buku yang telah di-edit:", editedBook);

  modal.style.display = "none";
});

// Initial Render
document.addEventListener("DOMContentLoaded", renderBooks);
