// Get the objects we need to modify
let addPersonForm = document.getElementById("add-house-form-ajax");

// Modify the objects we need
addPersonForm.addEventListener("submit", function (e) {
  // Prevent the form from submitting
  e.preventDefault();

  // Get form fields we need to get data from
  let inputHouseName = document.getElementById("input-house_name");
  let inputHouseFounder = document.getElementById("input-house_founder");

  // Get the values from the form fields
  let houseNameValue = inputHouseName.value;
  let houseFounderValue = inputHouseFounder.value;

  // handles empty values
  if (houseNameValue === "" || houseFounderValue === "") {
    window.alert("Please enter a valid house name and founder.");
    return;
  }

  // sanitize house name values
  const sanitizeHouse = houseNameValue.split(" ");
  for (let i = 0; i < sanitizeHouse.length; i++) {
    sanitizeHouse[i] =
      sanitizeHouse[i][0].toUpperCase() + sanitizeHouse[i].substr(1);
  }

  // sanitize founder name values
  const sanitizeFounder = houseFounderValue.split(" ");
  for (let i = 0; i < sanitizeFounder.length; i++) {
    sanitizeFounder[i] =
      sanitizeFounder[i][0].toUpperCase() + sanitizeFounder[i].substr(1);
  }

  houseNameValue = sanitizeHouse.join(" ");
  houseFounderValue = sanitizeFounder.join(" ");

  // Put our data we want to send in a javascript object
  let data = {
    house_name: houseNameValue,
    house_founder: houseFounderValue,
  };

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/add-house-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      window.location.href = `/houses`;
      window.alert("Added house!");

      // Clear the input fields for another transaction
      inputHouseName.value = "";
      inputHouseFounder.value = "";
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");

      window.alert("There was an error adding house.");
      // Clear the input fields for another transaction
      inputHouseName.value = "";
      inputHouseFounder.value = "";
    }
  };

  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
});
