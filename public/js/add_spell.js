// Get the objects we need to modify
let addSpellForm = document.getElementById("add-spell-form-ajax");

// Modify the objects we need
addSpellForm.addEventListener("submit", function (e) {
  // Prevent the form from submitting
  e.preventDefault();

  // Get form fields we need to get data from
  let inputSpellName = document.getElementById("input-spell-name");
  let inputSpellDescription = document.getElementById("input-spell-desc");
  let inputSpellType = document.getElementById("input-spell-type");

  // Get the values from the form fields
  let spellNameValue = inputSpellName.value; // returns string
  let spellDescValue = inputSpellDescription.value; // returns string
  let spellTypeValue = inputSpellType.value; // returns type id (int)

  // sanitize spell name
  const sanitizeName = spellNameValue.split(" ");
  for (let i = 0; i < sanitizeName.length; i++) {
    sanitizeName[i] =
      sanitizeName[i][0].toUpperCase() + sanitizeName[i].substr(1);
  }

  // sanitize spell description
  const sanitizeDesc =
    spellDescValue[0].toUpperCase() + spellDescValue.substring(1);

  spellNameValue = sanitizeName.join(" ");
  spellDescValue = sanitizeDesc;

  // Put our data we want to send in a javascript object
  let data = {
    spell_name: spellNameValue,
    spell_desc: spellDescValue,
    spell_type: spellTypeValue,
  };

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/add-spell-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request ghow to resolve
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // Add the new data to the table
      addRowToTable(xhttp.response);

      // Clear the input fields for another transaction
      inputSpellName.value = "";
      inputSpellGraduated.value = "";
      inputSpellHouse.value = "";
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
  let currentTable = document.getElementById("spell-table");

  // Get the location where we should insert the new row (end of table)
  let newRowIndex = currentTable.rows.length;

  // Get a reference to the new row from the database query (last object)
  let parsedData = JSON.parse(data);
  let newRow = parsedData[parsedData.length - 1];

  // Create a row and 4 cells
  let row = document.createElement("TR");
  let idCell = document.createElement("TD");
  let nameCell = document.createElement("TD");
  let descCell = document.createElement("TD");
  let typeCell = document.createElement("TD");

  // Fill the cells with correct data
  idCell.innerText = newRow.spell_id;
  nameCell.innerText = newRow.spell_name;
  descCell.innerText = newRow.spell_description;
  typeCell.innerText = newRow.type_name;
  let editCell = document.createElement("TD");
  let deleteCell = document.createElement("TD");

  // Create cell for edit button
  let editLink = document.createElement("a");
  editLink.href = `updateSpell/${newRow.spell_id}`;
  let editButton = document.createElement("button");
  editButton.innerText = "Edit";
  editLink.appendChild(editButton);

  // Create cell for delete button
  let deleteButton = document.createElement("INPUT");
  deleteButton.setAttribute("type", "submit");
  deleteButton.value = "Delete";
  deleteButton.addEventListener(
    "onclick",
    console.log("figure out how to delete spell here")
  );
  deleteCell.appendChild(deleteButton);

  // Add the cells to the row
  row.appendChild(idCell);
  row.appendChild(nameCell);
  row.appendChild(descCell);
  row.appendChild(typeCell);
  row.appendChild(editLink);
  row.appendChild(deleteCell);

  // Add the row to the table
  currentTable.appendChild(row);
};
