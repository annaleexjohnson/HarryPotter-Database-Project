// get update Wizard Form
let updateWizardForm = document.getElementById("update-wizard-form-ajax");

updateWizardForm.addEventListener("submit", function (e) {
  // prevent default behavior
  e.preventDefault();

  //get form values
  let wizardID = document.getElementById("update-wizard-id").innerText;
  let wizardName = document.getElementById("update-wizard-name");
  let wizardHouse = document.getElementById("update-wizard-house");
  let wizardGraduated = document.getElementById("update-wizard-graduated");

  // Get the values from the form fields
  let wizardNameValue = wizardName.value; // returns wizard id (int)
  let wizardGraduatedValue = parseInt(wizardGraduated.value); // returns int
  let wizardHouseValue = wizardHouse.value; // returns house id (int)

  // handles invalid input
  if (wizardNameValue === "") {
    window.alert("Error: You must enter a name.");
    return;
  }

  // Put our data we want to send in a javascript object
  let data = {
    wizard_id: wizardID,
    wizard_name: wizardNameValue,
    wizard_graduated: wizardGraduatedValue,
    wizard_house: wizardHouseValue,
  };

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/put-wizard-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // Add the new data to the table
      //   updateRow(xhttp.response, wizardNameValue);

      window.location.href = `/wizards`;
      window.alert("Updated wizard");

      // Clear the input fields for another transaction
      wizardName.value = "";
      wizardGraduated.value = "";
      wizardHouse.value = "";
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the update.");
      window.alert("Couldn't update wizard :(");
    }
  };

  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
});
