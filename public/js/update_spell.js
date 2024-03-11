/* 
*******************************
  NOTE: ONLY UPDATES SPELL NAME AND DESCRIPTION
*******************************
*/

// get update Spell Form
let updateSpellForm = document.getElementById("update-spell-form-ajax");

updateSpellForm.addEventListener("submit", function (e) {
  // prevent default behavior
  e.preventDefault();

  //get form values
  let spellID = document.getElementById("update-spell-id").innerText; // returns string
  let spellName = document.getElementById("update-spell-name");
  let spellDesc = document.getElementById("update-spell-desc");

  // Get the values from the form fields
  let spellNameValue = spellName.value; // returns string
  let spellDescValue = spellDesc.value; // returns string

  // handles invalid input
  if (spellNameValue === "") {
    return;
  }

  // sanitize spell name
  const sanitizeName = spellNameValue.split(" ");
  for (let i = 0; i < sanitizeName.length; i++) {
    sanitizeName[i] =
      sanitizeName[i][0].toUpperCase() + sanitizeName[i].substr(1);
  }

  // sanitize spell description
  const sanitizeDesc =
    spellDescValue[0].toUpperCase() + spellDescValue.substring(1);

  spellNameValue = sanitizeName.join(" ");
  spellDescValue = sanitizeDesc;

  // Put our data we want to send in a javascript object
  let data = {
    spell_id: spellID,
    spell_name: spellNameValue,
    spell_desc: spellDescValue,
  };

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/put-spell-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // Add the new data to the table
      updateRow(xhttp.response, spellID);

      window.location.href = `/updateSpell/${spellID}`;
      window.alert("Updated spell name and/or description!");
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the update.");
    }
  };

  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
});

function updateRow(data, spellID) {
  let parsedData = JSON.parse(data);

  let table = document.getElementById("update-spell-table");

  for (let i = 0, row; (row = table.rows[i]); i++) {
    //iterate through rows
    //rows would be accessed using the "row" variable assigned in the for loop
    if (table.rows[i].getAttribute("data-value") == spellID) {
      // Get the location of the row where we found the matching person ID
      let updateRowIndex = table.getElementsByTagName("tr")[i];

      // Get td of name value
      let updateNameCell = updateRowIndex.getElementsByTagName("td")[1];
      // Get td of description value
      let updateDescCell = updateRowIndex.getElementsByTagName("td")[2];

      // Reassign spell row data
      updateNameCell.innerHTML = parsedData[0].spell_name;
      updateDescCell.innerHTML = parsedData[0].spell_description;
    }
  }
}
