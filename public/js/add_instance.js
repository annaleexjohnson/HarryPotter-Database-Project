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

  if (notesValue.length > 0) {
    // sanitize notes
    const sanitizeNotes = notesValue[0].toUpperCase() + notesValue.substring(1);
    notesValue = sanitizeNotes;
  }

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
      window.location.href = `/instances`;
      window.alert("Added instance!");

      // Clear the input fields for another transaction
      inputWizardName.value = "";
      inputSpellName.value = "";
      inputNotes.value = "";
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");
    }
  };

  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
});
