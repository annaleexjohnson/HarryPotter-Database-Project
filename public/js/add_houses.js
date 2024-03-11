// Get the objects we need to modify
let addPersonForm = document.getElementById("add-house-form-ajax");

// Modify the objects we need
addPersonForm.addEventListener("submit", function (e) {
  // Prevent the form from submitting
  e.preventDefault();

  // Get form fields we need to get data from
  let inputHouseName = document.getElementById("input-house_name");
  let inputHouseFounder = document.getElementById("input-house_founder");

  // Get the values from the form fields
  let houseNameValue = inputHouseName.value;
  let houseFounderValue = inputHouseFounder.value;

  // sanitize house name values
  const sanitizeHouse = houseNameValue.split(" ");
  for (let i = 0; i < sanitizeHouse.length; i++) {
    sanitizeHouse[i] =
      sanitizeHouse[i][0].toUpperCase() + sanitizeHouse[i].substr(1);
  }

  // sanitize founder name values
  const sanitizeFounder = houseFounderValue.split(" ");
  for (let i = 0; i < sanitizeFounder.length; i++) {
    sanitizeFounder[i] =
      sanitizeFounder[i][0].toUpperCase() + sanitizeFounder[i].substr(1);
  }

  houseNameValue = sanitizeHouse.join(" ");
  houseFounderValue = sanitizeFounder.join(" ");

  // Put our data we want to send in a javascript object
  let data = {
    house_name: houseNameValue,
    house_founder: houseFounderValue,
  };

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/add-house-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // Add the new data to the table
      addRowToTable(xhttp.response);

      // Clear the input fields for another transaction
      inputHouseName.value = "";
      inputHouseFounder.value = "";
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");
    }
  };

  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
});

// Creates a single row from an Object representing a single record from
// bsg_people
addRowToTable = (data) => {
  // Get a reference to the current table on the page and clear it out.
  let currentTable = document.getElementById("house-table");

  // Get the location where we should insert the new row (end of table)
  let newRowIndex = currentTable.rows.length;

  // Get a reference to the new row from the database query (last object)
  let parsedData = JSON.parse(data);
  let newRow = parsedData[parsedData.length - 1];

  // Create a row and 4 cells
  let row = document.createElement("TR");
  let idCell = document.createElement("TD");
  let houseNameCell = document.createElement("TD");
  let houseFounderCell = document.createElement("TD");

  // Fill the cells with correct data
  idCell.innerText = newRow.house_id;
  houseNameCell.innerText = newRow.house_name;
  houseFounderCell.innerText = newRow.house_founder;

  // Add the cells to the row
  row.appendChild(idCell);
  row.appendChild(houseNameCell);
  row.appendChild(houseFounderCell);

  // Add the row to the table
  currentTable.appendChild(row);
};
