function deleteWizard(wizardID) {
    // Put our data we want to send in a javascript object
    let data = {
        wizard_id: wizardID
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-wizard-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(wizardID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(wizardID){

    let table = document.getElementById("wizard-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == wizardID) {
            table.deleteRow(i);
            deleteDropDownMenu(wizardID);
            break;
       }
    }
}

// remove wizard from update wizard form option
function deleteDropDownMenu(wizardID){
    let selectMenu = document.getElementById("update-wizard-name");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(personID)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }

