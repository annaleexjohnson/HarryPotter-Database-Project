// get update Wizard Form
let updateWizardForm = document.getElementById('update-wizard-form-ajax');

updateWizardForm.addEventListener("submit", function (e) {
   // prevent default behavior
    e.preventDefault()

    //get form values
    let wizardName = document.getElementById("update-wizard-name")
    let wizardHouse = document.getElementById("update-wizard-house")
    let wizardGraduated = document.getElementById("update-wizard-graduated")

    // Get the values from the form fields
    let wizardNameValue = wizardName.value;                         // returns wizard id (int)
    let wizardGraduatedValue = parseInt(wizardGraduated.value);     // returns int
    let wizardHouseValue = wizardHouse.value;                       // returns house id (int)

    // handles invalid input
    if(wizardNameValue === "" | wizardHouseValue === "" | wizardGraduatedValue === ""){
        return
    }

     // Put our data we want to send in a javascript object
    let data = {
        wizard_id: wizardNameValue,
        wizard_graduated: wizardGraduatedValue,
        wizard_house: wizardHouseValue,
    }

     // Setup our AJAX request
     var xhttp = new XMLHttpRequest();
     xhttp.open("PUT", "/put-wizard-ajax", true);
     xhttp.setRequestHeader("Content-type", "application/json");
 
     // Tell our AJAX request how to resolve
     xhttp.onreadystatechange = () => {
         if (xhttp.readyState == 4 && xhttp.status == 200) {
 
             // Add the new data to the table
             updateRow(xhttp.response, wizardNameValue);
 
             // Clear the input fields for another transaction
             wizardName.value = '';
             wizardGraduated.value = '';
             wizardHouse.value = '';
         }
         else if (xhttp.readyState == 4 && xhttp.status != 200) {
             console.log("There was an error with the update.")
         }
     }
 
     // Send the request and wait for the response
     xhttp.send(JSON.stringify(data));
})


function updateRow(data, wizardID){
    let parsedData = JSON.parse(data);
    console.log("parsed data:", parsedData)
    
    let table = document.getElementById("wizard-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == wizardID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of graduated value
            let updateGraduatedCell = updateRowIndex.getElementsByTagName("td")[2];
            // Get td of house value
            let updateHouseCell = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign wizard graduated and house data
            updateGraduatedCell.innerHTML = parsedData[0].wizard_graduated; 
            updateHouseCell.innerHTML = parsedData[0].wizard_house; 
       }
    }
}