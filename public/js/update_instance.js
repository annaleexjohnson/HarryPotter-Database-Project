/* 
*******************************
  NOTE: ONLY UPDATES SPELL NAME AND DESCRIPTION
*******************************
*/

// get update Spell Form
let updateInstanceForm = document.getElementById("update-instance-form-ajax");

updateInstanceForm.addEventListener("submit", function (e) {
  // prevent default behavior
  e.preventDefault();

  //get form values
  let instanceID = document.getElementById("update-instance-id").innerText; // returns string
  let wizardName = document.getElementById("update-wizards-option");
  let spellName = document.getElementById("update-spells-option");
  let notes = document.getElementById("input-instance-notes");

  // Get the values from the form fields
  let wizardNameValue = wizardName.value;
  let spellNameValue = spellName.value;
  let notesValue = notes.value;

  // sanitize notes
  const sanitizeNotes = notesValue[0].toUpperCase() + notesValue.substring(1);
  notesValue = sanitizeNotes;

  // Put our data we want to send in a javascript object
  let data = {
    instance_id: instanceID,
    wizard_name: wizardNameValue,
    spell_name: spellNameValue,
    notes: notesValue,
  };

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/put-instance-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      window.location.href = `/instances`;
      window.alert("Updated instance!");

      // reset form values
      wizardName.value = "";
      spellName.value = "";
      notes.value = "";
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      // null error alert
      if ((xhttp.response = "ER_BAD_NULL_ERROR")) {
        window.alert("Please add a valid wizard/spell from the database.");
      } else {
        window.alert("There was an error adding the spell instance.");
      }

      // reset form values
      wizardName.value = "";
      spellName.value = "";
      notes.value = "";
    }
  };

  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
});
