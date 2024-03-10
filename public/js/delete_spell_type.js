/* 
*******************************
  NOTE: ONLY DELETES SPELL TYPE(S)
*******************************
*/

function deleteSpellType(spellID, typeID) {
  let data = {
    spell_id: spellID,
    type_id: typeID,
  };

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/delete-spell-type-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 204) {
      // Refresh page
      window.location.href = `/updateSpell/${spellID}`;
      window.alert("Deleted spell type!");
    } else if (xhttp.readyState == 4 && xhttp.status != 204) {
      console.log("There was an error with the input.");
    }
  };
  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
}
