// Get the objects we need to modify
let addTypeForm = document.getElementById("add-type-form-ajax");

// Modify the objects we need
addTypeForm.addEventListener("submit", function (e) {
  // Prevent the form from submitting
  e.preventDefault();

  // Get form fields we need to get data from
  let inputTypeName = document.getElementById("input-type-name");
  let inputTypeDesc = document.getElementById("input-type-desc");

  // Get the values from the form fields
  let typeNameValue = inputTypeName.value;
  let typeDescValue = inputTypeDesc.value;

  // handle null input
  if (typeNameValue === "") {
    window.alert("Please enter a name for the spell type.");
    return;
  }

  // sanitize type nae
  const sanitizeName = typeNameValue.split(" ");
  for (let i = 0; i < sanitizeName.length; i++) {
    sanitizeName[i] =
      sanitizeName[i][0].toUpperCase() + sanitizeName[i].substr(1);
  }

  // sanitize type description
  const sanitizeDesc =
    typeDescValue[0].toUpperCase() + typeDescValue.substring(1);

  typeNameValue = sanitizeName.join(" ");
  typeDescValue = sanitizeDesc;

  // Put our data we want to send in a javascript object
  let data = {
    typeName: typeNameValue,
    typeDesc: typeDescValue,
  };

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/add-type-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      window.location.href = `/types`;
      window.alert("Added spell type!");

      // Clear the input fields for another transaction
      inputTypeName.value = "";
      inputTypeDesc.value = "";
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");
    }
  };

  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
});
