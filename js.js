// Ahmed Youssef

let productName = document.getElementById("name");
let price = document.getElementById("price");
let quantity = document.getElementById("quantity");
let category = document.getElementById("category");

let editButton = document.getElementById("editButton");
let deleteButton = document.getElementById("deleteButton");
let clearAllButton = document.getElementById("clearAllButton");

let addButton = document.getElementById("add");
let editButtonInput = document.getElementById("edit");

let table = document.getElementById("table");

// Global variable to track the currently selected row.
let currentSelectedRow = null;

// The array that will holds every product object.
let arrayOfProducts = [];

// Get the data from the local storage and but it on the table when the page loads.
window.onload = loadDataFromLocalStorage;

// Initial call to add listeners to the table rows when the page loads
// (To fill the table with the data from the local storage).
addRowListeners();

// -----------------------------------------------------------------------------------------------------------

// function to store data in the array (to prevent deleting the data from the local storage after refreshing the page)
// and enable 'clear all' button if the local storage isn't empty.

// Check if 'product' key exists in localStorage and is not null.
if (localStorage.getItem("product") !== null) {
  // To store all data in the 'arrayOfProducts' array.
  arrayOfProducts = JSON.parse(localStorage.getItem("product"));
  clearAllButton.classList.remove("disabled"); // To enable the 'clear all' button.
}

// -----------------------------------------------------------------------------------------------------------

// Function to store data in the local storage.
// Note that this function is responsible of:
// 1. Adding the data to the 'arrayOfProducts' array and the local storage.
//
// the functionality of this function is:
//   1. Create an object 'obj' to store a product data.
//   2. Push this obj to 'arrayOfProducts' array.
//   3. Sort the 'arrayOfProducts' array in the local storage.
//   4. call 'loadDataFromLocalStorage' function to add new data to the table.
//
// So this is the only function tha adds the data to the local storage.
// (not the table), then it call 'loadDataFromLocalStorage' function to add the data to the table.

function add() {
  if (
    productName.value == "" ||
    price.value == "" ||
    quantity.value == "" ||
    category.value == ""
  ) {
    alert("Fill all values");
  } else {
    // 1. Create an object 'obj' to store a product data.
    const obj = {
      name: productName.value,
      price: price.value,
      quantity: quantity.value,
      category: category.value,
    };

    // 2. Push this obj to 'arrayOfProducts' array.
    arrayOfProducts.push(obj);
    // 3. Sort the 'arrayOfProducts' array in the local storage
    localStorage.setItem("product", JSON.stringify(arrayOfProducts));
    rest();

    // Call the function to add the new data to the table
    loadDataFromLocalStorage();
  }
}

// -----------------------------------------------------------------------------------------------------------

// Function to load data from local storage and sort it in the table

// Note that this is the only function that responsible of:
//   1. Handle the 'products' counter (using 'updateCounter' function).
//   2. Handle the 'No.' in the table (first column in the table).
//   4. Creating an empty row in the table (if local storage is empty).
//   3. Populating the table with data (from local storage).
//   5. Adding event listener to all rows in the table (using 'addRowListeners' function).
//
// So the only way to show the data in the table is to get it firstly from the local storage,
// then adding it to the table using this function (i mean not directly from the input fields).
//
// The functionally of adding data from the local storage is:
//  If the local storage contains data:
//    1. Fill the 'storedProducts' array with data from the local storage.
//    2. Call the table body then delete all the data (rows) in it.
//    3. iterate on the table body (by 'arrayOfProducts' array length times).
//    4. For each iteration, create a new row in the table body and add the
//       data from the 'storedProducts' array to it.
//    5. Call the 'updateCounter' function to update the 'products' counter.
//    6. Call the 'addRowListeners' function to add event listener to all rows.
//
//  If the local storage is empty
//    1. Create an empty row in the table body

function loadDataFromLocalStorage() {
  const storedProducts = localStorage.getItem("product");

  if (storedProducts) {
    // 1. Fill the 'storedProducts' array with data from the local storage;
    arrayOfProducts = JSON.parse(storedProducts);
    clearAllButton.classList.remove("disabled");
  } else {
    arrayOfProducts = []; // Clear the array if there's nothing in local storage
  }

  // Get the table body
  const tableBody = document
    .getElementById("productTable")
    .getElementsByTagName("tbody")[0];

  // 2. Call the table body then delete all the data (rows) in it
  tableBody.innerHTML = "";

  // 3. iterate on the table body (by 'arrayOfProducts' array length times)
  if (arrayOfProducts.length > 0) {
    // 4. Populate rows with data from local storage
    for (let i = 0; i < arrayOfProducts.length; i++) {
      const row = tableBody.insertRow(); // add new rew to the table

      // creates cell to the new row and fill their values from the local storage
      row.insertCell(0).innerText = i + 1; // The product (row) number.
      row.insertCell(1).innerText = arrayOfProducts[i].name;
      row.insertCell(2).innerText = arrayOfProducts[i].price;
      row.insertCell(3).innerText = arrayOfProducts[i].quantity;
      row.insertCell(4).innerText = arrayOfProducts[i].category;
    }
  } else {
    // If the local storage is empty create an empty row in the table
    const row = tableBody.insertRow();
    row.insertCell(0).innerText = ""; // The product (row) number.
    row.insertCell(1).innerText = ""; // Empty cell for product name
    row.insertCell(2).innerText = ""; // Empty cell for price
    row.insertCell(3).innerText = ""; // Empty cell for quantity
    row.insertCell(4).innerText = ""; // Empty cell for category
    // Note that this is just for the appearance of the table (so that we don't make the table body empty
    // and just the table head is the shown), functionally this row will be deleted,
    // and then another one will be created with the data (it works only if the local storage is empty).
  }

  // Update the counter and reapply row listeners fot the new rows
  updateCounter();
  addRowListeners();
}

// -----------------------------------------------------------------------------------------------------------

// Function to count the products.

// The functionality of this function is:
//   1. Get the table body element.
//   2. Initialize a counter to keep track of filled rows.
//   3. Iterate over each row in the table body.
//   4. For each row, check if the first cell is empty (if it is empty then the full row is empty also).
//   5. If the first cell is not empty, increment the filled rows counter.
//   6. After iterating over all rows, update the counter display element with the total number of filled rows.

function updateCounter() {
  const tableBody = document
    .getElementById("productTable")
    .getElementsByTagName("tbody")[0];
  let filledRowsCount = 0;

  // Iterate over the rows to count those that are filled
  for (let i = 0; i < tableBody.rows.length; i++) {
    let row = tableBody.rows[i];

    // Check if the first cell is not empty (indicating the row is filled)
    if (row.cells[0].innerText !== "") {
      filledRowsCount++;
    }
  }

  // Update the counter display
  document.getElementById("productNum").innerText = filledRowsCount;
}

// -----------------------------------------------------------------------------------------------------------

// Function to add event listeners to all rows.
function addRowListeners() {
  let tableRows = table.rows.length;
  for (let i = 1; i < tableRows; i++) {
    table.rows[i].addEventListener("click", rowClickHandler); // Add new listener.
  }
}

// -----------------------------------------------------------------------------------------------------------

// Handler function for row clicks
function rowClickHandler() {
  // If there's a previously selected row, remove the selected-row class.
  if (currentSelectedRow) {
    currentSelectedRow.classList.remove("selected-row");
  }

  // Set the clicked row as the currently selected row and apply the class "selected-row".
  currentSelectedRow = this; // 'this' word refers to the selected row that the event listener applied on.
  this.classList.add("selected-row");
  if (currentSelectedRow.classList.contains("highlighted-row")) {
    currentSelectedRow.classList.remove("highlighted-row");
    currentSelectedRow.classList.add("selected-row");
  }

  // Function(s) will be executed when a row is selected
  enabledButtons();
}

// -----------------------------------------------------------------------------------------------------------

// Add a click event listener to the document (the whole page) to deselect the row when clicking elsewhere
document.addEventListener("click", function (event) {
  if (currentSelectedRow && !event.target.closest("table")) {
    if (
      // If a row is selected, and user clicked on any element in the page except this elements
      // the selection will be removed
      event.target !== editButton &&
      event.target !== deleteButton &&
      event.target !== productName &&
      event.target !== price &&
      event.target !== quantity &&
      event.target !== category
    ) {
      currentSelectedRow.classList.remove("selected-row");
      currentSelectedRow = null;
      disabledButtons();
      hideApplyEditingButton();
      rest();
    }
  }
  const isClickInsideTable = event.target.closest("#table");
  const isClickInsideInput = event.target.closest("#searchInput");
  const isClickInsideButton = event.target.closest("#searchButton");

  if (!isClickInsideTable && !isClickInsideInput && !isClickInsideButton) {
    const rows = document.getElementById("table").getElementsByTagName("tr");
    clearHighlights(rows);
    console.log("out of table, searchButton and searchInput");
    searchInput.value = "";
  }
});

// -----------------------------------------------------------------------------------------------------------

//  Function to add the selected row data to the input fields.
//  (This function will be executed when clicked on "Edit" button under the table).

function addToInputFields() {
  if (currentSelectedRow) {
    let cells = currentSelectedRow.getElementsByTagName("td");
    productName.value = cells[1].innerText;
    price.value = cells[2].innerText;
    quantity.value = cells[3].innerText;
    category.value = cells[4].innerText;
    showApplyEditingButton();
  } else {
    alert("Select a row to edit");
  }
}

// -----------------------------------------------------------------------------------------------------------

// function to apply edits on the selected row.
// (This function will be executed when clicked on "Edit button" under the input fields).
//
// The functionally of this function is;
//   1. Get the index of the selected in row in the table.
//   2. Get the selected row element in the 'arrayOfProducts' array.
//   3. Update data of selected row element in the array with the new values from the input fields.
//   4. Update the local storage with the new array (after updating the element of selected row).
//   5. Update the table with the new data in the local storage with 'loadDataFromLocalStorage()' function.
//
// So the table doesn't be uploaded directly, first we update the local storage then,
// we load the updated data from the local storage to the table.

function edit() {
  if (currentSelectedRow) {
    // 1. Get the index of the selected in row in the table.
    let rowIndex = currentSelectedRow.rowIndex - 1; // Adjusting for 0-based index

    // Update the corresponding object in the array
    arrayOfProducts[rowIndex /*step 2*/] = {
      // 3. Update data of selected row element in the array with the new values from the input fields.
      name: productName.value,
      price: price.value,
      quantity: quantity.value,
      category: category.value,
    };

    // 4. Update the local storage with the new array (after updating the element of selected row).
    localStorage.setItem("product", JSON.stringify(arrayOfProducts));

    // 5. Reload the table data from local storage after editing
    loadDataFromLocalStorage();

    // Reset input fields and buttons after editing
    rest();
    hideApplyEditingButton();

    // Clear the selection of the selected row after editing
    currentSelectedRow.classList.remove("selected-row");
    currentSelectedRow = null;
    disabledButtons();
  } else {
    alert("Select a row to edit");
  }
}

// -----------------------------------------------------------------------------------------------------------

// Function to delete selected row.
// This function will be called when the 'Delete' button is clicked.

// The functionality of this function is;
// 1. Get the selected row index from the table.
// 2. Retrieve the corresponding row element from the 'arrayOfProducts' array using the row index.
// 3. Delete the element from the 'arrayOfProducts' array.
// 4. Update the local storage with the modified 'arrayOfProducts' array.
// 5. Refill the table content using the 'loadDataFromLocalStorage' function to
//    reflect the changes made in local storage.

function deleteRow() {
  // 1. Get the selected row index from the table.
  if (currentSelectedRow) {
    // 2. Retrieve the corresponding row element from the 'arrayOfProducts' array using the row index
    let rowIndex = currentSelectedRow.rowIndex - 1; // Subtract 1 because rowIndex is 1-based (to get a 0-based index that matches the array.)

    // 3. Delete the element from the 'arrayOfProducts' array.    // This method deletes the selected row element from the array and shifting all the element after it to fill the gap.
    arrayOfProducts.splice(rowIndex, 1);

    // 4. Update the local storage with the modified 'arrayOfProducts' array.
    localStorage.setItem("product", JSON.stringify(arrayOfProducts));

    // 5. Refill the table content using the 'loadDataFromLocalStorage'
    loadDataFromLocalStorage();

    // Reset the input fields and buttons
    rest();
    disabledButtons();
    currentSelectedRow = null;
  } else {
    alert("Select a row to delete");
  }
}

// -----------------------------------------------------------------------------------------------------------

// Main search function
function search() {
  let searchInput = document.getElementById("searchInput").value.toLowerCase();

  if (searchInput === "") {
    alert("Enter a value to search for");
    return; // Stop execution if input is empty
  }

  const table = document.getElementById("table");
  const rows = table.getElementsByTagName("tr");
  let matchFound = false; // Flag to track if any matches are found

  clearHighlights(rows); // Clear previous highlights

  // Highlight the matching rows and cells
  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    let rowHasMatch = false;
    for (let j = 0; j < cells.length; j++) {
      if (cells[j].textContent.toLowerCase().includes(searchInput)) {
        rowHasMatch = true;
        cells[j].classList.add("highlighted-cell");
        matchFound = true;
      }
    }
    if (rowHasMatch) {
      rows[i].classList.add("highlighted-row");
    }
  }

  // If no match is found, show an alert
  if (!matchFound) {
    alert("No matching results found");
  }
}

// -----------------------------------------------------------------------------------------------------------

// Function to delete all the data.

// The functionality of this function is:
//   1. Clear all data from local storage.
//   2. Empty the 'arrayOfProducts' array.
//   3. Call the 'loadDataFromLocalStorage' function to refresh the table content based on the cleared local storage.
//   4. Disable the "Clear All" button to prevent accidental multiple clicks.
function clearAll() {
  localStorage.clear();
  arrayOfProducts = [];
  loadDataFromLocalStorage();
  clearAllButton.classList.add("disabled");
}

// -----------------------------------------------------------------------------------------------------------
function enabledButtons() {
  editButton.classList.remove("disabled");
  deleteButton.classList.remove("disabled");
}
// -----------------------------------------------------------------------------------------------------------
function disabledButtons() {
  editButton.classList.add("disabled");
  deleteButton.classList.add("disabled");
}
// -----------------------------------------------------------------------------------------------------------
function showApplyEditingButton() {
  addButton.classList.add("displayNone");
  editButtonInput.classList.remove("displayNone");
}
// -----------------------------------------------------------------------------------------------------------
function hideApplyEditingButton() {
  addButton.classList.remove("displayNone");
  editButtonInput.classList.add("displayNone");
}
// ----------------------------------------------------------------------------------------------------------
// To clear all the input fields
function rest() {
  productName.value = "";
  price.value = "";
  quantity.value = "";
  category.value = "";
  searchInput.value = "";
}
// -----------------------------------------------------------------------------------------------------------

// Function to handel highlighting a searched-for row
function clearHighlights(rows) {
  for (let i = 0; i < rows.length; i++) {
    rows[i].classList.remove("highlighted-row");
    const cells = rows[i].getElementsByTagName("td");
    for (let j = 0; j < cells.length; j++) {
      cells[j].classList.remove("highlighted-cell");
    }
  }
}
// -----------------------------------------------------------------------------------------------------------