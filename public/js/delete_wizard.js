function deleteWizard(wizardID) {
  // Put our data we want to send in a javascript object
  let data = {
    wizard_id: wizardID,
  };

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/delete-wizard-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 204) {
      window.location.href = `/wizards`;
      window.alert("Deleted wizard!");
    } else if (xhttp.readyState == 4 && xhttp.status != 204) {
      console.log("There was an error with the input.");
      window.alert("There was an error deleting this wizard.");
    }
  };
  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
}
