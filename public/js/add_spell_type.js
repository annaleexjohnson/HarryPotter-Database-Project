/* 
*******************************
  NOTE: ONLY ADDS SPELL TYPE
*******************************
*/

// get update Spell Form
let addSpellTypeForm = document.getElementById("add-spell-type-form-ajax");

addSpellTypeForm.addEventListener("submit", function (e) {
  // prevent default behavior
  e.preventDefault();

  let spellID = document.getElementById("update-spell-id").innerText; // returns string

  // Get the values from the form fields
  let addSpellType = document.getElementById("add-spell-type");
  let addSpellTypeValue = addSpellType.value;

  // Put our data we want to send in a javascript object
  let data = {
    spell_id: spellID,
    spell_type: addSpellTypeValue,
  };

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/post-spell-type-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      window.location.href = `/updateSpell/${spellID}`;
      window.alert("Added spell type!");
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the update.");

      if ((xhttp.response = "ER_DUP_ENTRY")) {
        window.alert("Could not add type: The spell already has this type.");
      } else {
        window.alert("There was an error adding the type.");
      }
    }
  };

  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
});
