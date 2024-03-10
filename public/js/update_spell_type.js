/* 
*******************************
  NOTE: ONLY UPDATES SPELL TYPES
*******************************
*/

function updateSpellType(spellID, initTypeID) {
  // get form
  let spellTypeForm = document.getElementById(
    `update-spell-type-form-ajax-${spellID}-${initTypeID}`
  );

  // get new type
  let newSpellType =
    spellTypeForm.getElementsByClassName("update-spell-type")[0].value;

  let data = {
    spell_id: spellID,
    init_type_id: initTypeID,
    new_type_id: newSpellType,
  };

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/put-spell-type-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 204) {
      // Refresh page
      window.location.href = `/updateSpell/${spellID}`;
      window.alert("Updated spell type!");
    } else if (xhttp.readyState == 4 && xhttp.status != 204) {
      console.log("There was an error with the input.");
    }
  };
  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
}
