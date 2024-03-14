function deleteInstance(instanceID) {
  // Put our data we want to send in a javascript object
  let data = {
    instance_id: instanceID,
  };

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/delete-instance-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 204) {
      // Add the new data to the table
      window.location.href = `/instances`;
      window.alert("Deleted spell instance!");
    } else if (xhttp.readyState == 4 && xhttp.status != 204) {
      // handle errors
      window.alert("There was an error deleting the spell instance.");
    }
  };
  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
}
