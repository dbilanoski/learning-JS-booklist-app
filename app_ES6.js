let library = [];

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToLibrary(book) {
    library.push(book);
  }

  removeBookFromLibrary(id) {
    library.forEach(function(current, index) {
      if (current.isbn == id) {
        library.splice(index, 1);
      }
    });
  }

  filterBooks(searchText) {
    let collection = library.filter(function(current) {
      const regex = new RegExp(`^${searchText}`, "gi");
      return (
        current.title.match(regex) ||
        current.author.match(regex) ||
        current.isbn.match(regex)
      );
    });
    this.renderBooks(collection);
  }

  showAlert(message, className) {
    if (document.querySelector(".alert") === null) {
      // Create div
      const div = document.createElement("div");
      // Add classes
      div.classList.add("alert", className);
      // Append message
      div.appendChild(document.createTextNode(message));

      // Apend to wrapper
      const wrapper = document
        .querySelector(".upper")
        .insertBefore(div, document.querySelector("#book-form"));
    } else {
      return;
    }

    // Timeout after 3 sec
    setTimeout(function() {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  clearFields() {
    document.querySelectorAll("input[type=text]").forEach(function(current) {
      current.value = "";
    });
  }

  renderBooks(collection = library) {
    const list = document.getElementById("book-list");
    // Clear current book list
    list.innerHTML = "";

    // Create HTML for each library item
    collection.forEach(function(current) {
      //Create tr element
      const row = document.createElement("tr");
      // Insert cols to tr element
      row.innerHTML = `
      <td>${current.title}</td>
      <td>${current.author}</td>
      <td>${current.isbn}</td>
      <td><a href="#" class="delete"><i class="fas fa-trash-alt"></i></a></td>
    `;
      // Append row to list
      list.appendChild(row);
    });
  }
}

class Storage {
  getBooks() {
    let storageBooks;
    if (localStorage.getItem("books") === null) {
      storageBooks = [];
    } else {
      storageBooks = JSON.parse(localStorage.getItem("books"));
    }
    return storageBooks;
  }

  setBooks() {
    const books = this.getBooks();
    library = books;
  }

  addBookToStorage(book) {
    const books = this.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
    library = books;
  }

  removeBookFromStorage() {
    localStorage.setItem("books", JSON.stringify(library));
  }
}

// EVENT LISTENERS & MAIN LOGIC FLOW

// DOM LOAD Event
document.addEventListener("DOMContentLoaded", function() {
  const ui = new UI();
  const storage = new Storage();
  // Clear inputs
  ui.clearFields();
  // Set local storage content to library
  storage.setBooks();
  // Render booklist
  ui.renderBooks();
});

// Submit Event
document.getElementById("book-form").addEventListener("submit", function(e) {
  // Get input values
  const title = document.getElementById("title").value,
    author = document.getElementById("author").value,
    isbn = document.getElementById("isbn").value;

  // Instantiate needed objects
  const book = new Book(title, author, isbn);
  const ui = new UI();
  const storage = new Storage();

  // Input validation
  if (title === "" || author === "" || isbn === "") {
    ui.showAlert("Please fill in all fields.", "error");
  } else {
    // Add book to books
    ui.addBookToLibrary(book);
    // Add to local storage
    storage.addBookToStorage(book);
    // Clear input fields
    ui.clearFields();
    // Update & show booklist on page
    ui.renderBooks();
    // Notify user
    ui.showAlert("Book added succesfuly.", "success");
  }
  e.preventDefault();
});

// Delete Book Event
document.getElementById("book-list").addEventListener("click", function(e) {
  const ui = new UI();
  const storage = new Storage();
  if (e.target.parentElement.className == "delete") {
    // Remove book brom library
    ui.removeBookFromLibrary(
      e.target.parentElement.parentElement.previousElementSibling.innerHTML
    );
    console.log(library);
    // Remove book from local storage
    storage.removeBookFromStorage();
    // Clear inputs (in case filter was used to search for book)
    ui.clearFields();
    // Render booklist
    ui.renderBooks();
    // Notofy user
    ui.showAlert("Book deleted successfuly.", "success");
  } else {
    return;
  }
});

// Filter Input Event
const search = document.getElementById("search");
search.addEventListener("input", function() {
  const ui = new UI();
  ui.filterBooks(search.value);
});
