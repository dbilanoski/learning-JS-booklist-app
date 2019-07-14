/*
Temp Library array for data manipulation.

Books constructor for creating book object.
UI object for methods considenring data manipulation and rendering list and messages.
Storage object for methods considering updating local storage.

Books are added and removed from library.
When local storage is updaded, library is updated.

Render method for rendering new list after every update.
    --> It will have default parameter to render library object (option to render something else).
Filter method for filtering list.
    --> Here we will call render method and pass in new object to render list based on filter values.
 
 Events:
  Onload event for updating library from local storage and rendering list.
  Submit event for adding new books.
  Input event on search input field for filtering rendered list.
  Click event for deleting books from list.
*/

// Library
let library = [];

// BOOK CONSTRUCTOR
function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

// UI CONSTRUCTOR
function UI() {};

// Add Book to Library
UI.prototype.addBookToLibrary = function(book) {
  library.push(book);  
}

// Remove Book from Library
UI.prototype.removeBookFromLibrary = function(id) {
  library.forEach(function(current, index){
    if(current.isbn == id) {
      library.splice(index, 1);
    }
  })
}

// Notify user with stataus message
UI.prototype.showAlert = function(message, className) {
  if(document.querySelector(".alert") === null) {
    // Create div
      const div = document.createElement("div");
      // Add classes
      div.classList.add("alert", className);
      // Append message
      div.appendChild(document.createTextNode(message));
      
      // Apend to wrapper
      const wrapper = document.querySelector(".upper").insertBefore(div, document.querySelector("#book-form"));
    } else {
      return;
    }
  
    // Timeout after 3 sec
    setTimeout(function(){
      document.querySelector(".alert").remove();
    }, 3000);
}

// Filter books
UI.prototype.filterBooks = function(searchText) {
  // Take library array, attach filter method inside which we create RegExp filter value which says "this starts with", case insensitive
  let collection = library.filter(function(current) {
    const regex = new RegExp(`^${searchText}`, "gi");
    return current.title.match(regex) || current.author.match(regex) || current.isbn.match(regex);
  });
  this.renderBooks(collection);
}

UI.prototype.renderBooks = function(collection = library) {
  // If no parameter is set on calling the function, default library will be used
  // It means you can choose what to render

  const list = document.getElementById("book-list");
     // Clear current book list
  list.innerHTML = "";

  // Create HTML for each library item
  collection.forEach(function(current){
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
  })
  
 
}

// Clear Input Fields
UI.prototype.clearFields = function() {
  document.querySelectorAll("input[type=text]").forEach(function(current) {
    current.value = "";
  })
}

// LOCAL STORAGE CONSTRUCTOR
function Storage() {};


// Get Books from Local Storage
Storage.prototype.getBooks = function() {
  let storageBooks;
  if (localStorage.getItem("books") === null) {
    storageBooks = [];
  } else {
    storageBooks = JSON.parse(localStorage.getItem("books"));
  }
  return storageBooks;
}

// Set Books from Local Storage to Library
Storage.prototype.setBooks = function() {
  const books = this.getBooks();
  library = books;
}

// Add Books To local Storage
Storage.prototype.addBookToStorage = function(book) {
  const books = this.getBooks();
  books.push(book);
  localStorage.setItem("books", JSON.stringify(books));
  library = books;
}

// Remove books from local storage
Storage.prototype.removeBookFromStorage = function() {
  // For application after ui.removeBookFromLibrary() is finished
  // Library is already updated through ui.removeBookFromLibrary()
  localStorage.setItem("books", JSON.stringify(library));
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
})

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
})

// Delete Book Event
document.getElementById("book-list").addEventListener("click", function(e) {
  const ui = new UI();
  const storage = new Storage();
  if (e.target.parentElement.className == "delete") {
    // Remove book brom library
    ui.removeBookFromLibrary(e.target.parentElement.parentElement.previousElementSibling.innerHTML);
    console.log(library);
    // Remove book from local storage
    storage.removeBookFromStorage()
    // Clear inputs (in case filter was used to search for book)
    ui.clearFields();
    // Render booklist
    ui.renderBooks();
    // Notofy user
    ui.showAlert("Book deleted successfuly.", "success");
  } else {
      return;
   }
})

// Filter Input Event
const search = document.getElementById("search");
search.addEventListener("input", function(){
  const ui = new UI();
  ui.filterBooks(search.value);
})