/* 
*******************************
  UPDATE WIZARD JS
*******************************
*/

// Get the objects we need to modify
let addWizardForm = document.getElementById("add-wizard-form-ajax");

// Modify the objects we need
addWizardForm.addEventListener("submit", function (e) {
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

  // handle null values
  if (wizardNameValue === "") {
    window.alert("Please enter a name for the wizard.");
  }

  if (wizardHouseValue === "") {
    window.alert("Please select a house for the wizard.");
  }

  // sanitize inputs
  const sanitizeName = wizardNameValue.split(" ");

  for (let i = 0; i < sanitizeName.length; i++) {
    sanitizeName[i] =
      sanitizeName[i][0].toUpperCase() + sanitizeName[i].substr(1);
  }

  wizardNameValue = sanitizeName.join(" ");

  // Put our data we want to send in a javascript object
  let data = {
    wizard_name: wizardNameValue,
    wizard_graduated: wizardGraduatedValue,
    wizard_house: wizardHouseValue,
  };

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/add-wizard-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // Add the new data to the table
      window.location.href = `/wizards`;
      window.alert("Added wizard!");

      // Clear the input fields for another transaction
      inputWizardName.value = "";
      inputWizardGraduated.value = "";
      inputWizardHouse.value = "";
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");
    }
  };

  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
});
