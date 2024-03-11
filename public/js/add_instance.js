// Get the objects we need to modify
let addInstanceForm = document.getElementById("add-instance-form-ajax");

// Modify the objects we need
addInstanceForm.addEventListener("submit", function (e) {
  // Prevent the form from submitting
  e.preventDefault();

  // Get form fields we need to get data from
  let inputWizardName = document.getElementById("instances-wizards-option");
  let inputSpellName = document.getElementById("instances-spells-option");
  let inputNotes = document.getElementById("input-instance-notes");

  // get form values
  let wizardNameValue = inputWizardName.value;
  let spellNameValue = inputSpellName.value;
  let notesValue = inputNotes.value;

  // sanitize notes
  const sanitizeNotes = notesValue[0].toUpperCase() + notesValue.substring(1);

  notesValue = sanitizeNotes;

  // Put our data we want to send in a javascript object
  let data = {
    wizard_name: wizardNameValue,
    spell_name: spellNameValue,
    notes: notesValue,
  };

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/add-instance-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // Add the new data to the table
      addRowToTable(xhttp.response);

      // Clear the input fields for another transaction
      inputWizardName.value = "";
      inputSpellName.value = "";
      inputNotes.value = "";

      window.alert("Added spell instance");
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");
    }
  };

  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
});

addRowToTable = (data) => {
  // Get a reference to the current table on the page and clear it out.
  let currentTable = document.getElementById("instances-table");

  // Get the location where we should insert the new row (end of table)
  let newRowIndex = currentTable.rows.length;

  // Get a reference to the new row from the database query (last object)
  let parsedData = JSON.parse(data);
  let newRow = parsedData[parsedData.length - 1];

  // Create a row and 4 cells
  let row = document.createElement("TR");
  let idCell = document.createElement("TD");
  let wizardCell = document.createElement("TD");
  let spellCell = document.createElement("TD");
  let notesCell = document.createElement("TD");

  // Fill the cells with correct data
  idCell.innerText = newRow.instance_id;
  wizardCell.innerText = newRow.wizard_name;
  spellCell.innerText = newRow.spell_name;
  notesCell.innerText = newRow.notes;

  let editCell = document.createElement("TD");
  let deleteCell = document.createElement("TD");

  // Create cell for edit button
  let editLink = document.createElement("a");
  editLink.href = `updateInstance/${newRow.instance_id}`;
  let editButton = document.createElement("button");
  editButton.innerText = "Edit";
  editLink.appendChild(editButton);

  editCell.appendChild(editLink);

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
  row.appendChild(spellCell);
  row.appendChild(wizardCell);
  row.appendChild(notesCell);
  row.appendChild(editCell);
  row.appendChild(deleteCell);

  // Add the row to the table
  currentTable.appendChild(row);
};
