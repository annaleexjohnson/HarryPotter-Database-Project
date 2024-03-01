// App.js

/*
    SETUP
*/
var express = require("express"); // We are using the express library for the web server
var app = express(); // We need to instantiate an express object to interact with the server in our code
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
PORT = 45013; // Set a port number at the top so it's easy to change in the future

// app.js

const { engine } = require("express-handlebars");
var exphbs = require("express-handlebars"); // Import express-handlebars
app.engine(".hbs", engine({ extname: ".hbs" })); // Create an instance of the handlebars engine to process templates
app.set("view engine", ".hbs"); // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Database
var db = require("./database/db-connector");

/*s
    ROUTES
*/
// app.js

app.get("/wizards", function (req, res) {

  let query1 = "SELECT Wizards.wizard_id, Wizards.wizard_name, Wizards.wizard_graduated, Houses.house_name FROM Wizards, Houses WHERE Wizards.wizard_house = Houses.house_id GROUP BY Wizards.wizard_name;"

  let query2 = "SELECT * FROM Houses;";

  db.pool.query(query1, function (error, rows, fields) {
    // Execute the query

    let Wizards = rows;

    console.log(Wizards);

    db.pool.query(query2, (error, rows, fields) => {
      let Houses = rows;
      return res.render("index", { data: Wizards, Houses: Houses });
    });
  }); // an object where 'data' is equal to the 'rows' we
}); // received back from the query

// app.js - ROUTES section

app.post("/add-wizard-ajax", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  // Capture NULL values
  let wizard_graduated = parseInt(data.wizard_graduated);
  if (isNaN(wizard_graduated)) {
    wizard_graduated = "NULL";
  }

  let wizard_house = parseInt(data.wizard_house);
  if (isNaN(wizard_house)) {
    wizard_house = "NULL";
  }

  // Create the query and run it on the database
  query1 = `INSERT INTO Wizards (wizard_name, wizard_graduated, wizard_house) VALUES ('${data.wizard_name}', ${wizard_graduated}, ${wizard_house})`;
  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    } else {
      // If there was no error, perform a SELECT * on bsg_people
      query2 = `SELECT * FROM Wizards;`;
      db.pool.query(query2, function (error, rows, fields) {
        // If there was an error on the second query, send a 400
        if (error) {
          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error);
          res.sendStatus(400);
        }
        // If all went well, send the results of the query back.
        else {
          res.send(rows);
        }
      });
    }
  });
});

/*
    LISTENER
*/
app.listen(PORT, function () {
  // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
  console.log(
    "Express started on http://localhost:" +
      PORT +
      "; press Ctrl-C to terminate."
  );
});
