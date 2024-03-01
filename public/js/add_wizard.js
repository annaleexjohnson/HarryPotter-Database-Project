// Get the objects we need to modify
let addPersonForm = document.getElementById('add-wizard-form-ajax');

// Modify the objects we need
addPersonForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputWizardName = document.getElementById("input-wizard_name");
    let inputWizardGraduated = document.getElementById("input-wizard_graduated");
    let inputWizardHouse = document.getElementById("input-wizard_house");

    // Get the values from the form fields
    let wizardNameValue = inputWizardName.value;
    let wizardGraduatedValue = inputWizardGraduated.value;
    let wizardHouseValue = inputWizardHouse.value;

    console.log(wizardNameValue, wizardGraduatedValue, wizardHouseValue)

    // Put our data we want to send in a javascript object
    let data = {
        wizard_name: wizardNameValue,
        wizard_graduated: wizardGraduatedValue,
        wizard_house: wizardHouseValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-wizard-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputWizardName.value = '';
            inputWizardGraduated.value = '';
            inputWizardHouse.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("wizard-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let graduatedCell = document.createElement("TD");
    let houseCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.wizard_id;
    nameCell.innerText = newRow.wizard_name;
    graduatedCell.innerText = newRow.wizard_graduated;
    houseCell.innerText = newRow.house_name;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(graduatedCell);
    row.appendChild(houseCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}