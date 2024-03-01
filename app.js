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

/*
    ROUTES
*/
// app.js

// ******* Home Page *******
app.get('/', function(req, res){
    return res.render("index")
})


// ******* Wizards Page *******

//DISPLAY ALL WIZARD ROWS
app.get("/wizards", function (req, res) {

  let query1 = "SELECT Wizards.wizard_id, Wizards.wizard_name, Wizards.wizard_graduated, Houses.house_name FROM Wizards, Houses WHERE Wizards.wizard_house = Houses.house_id GROUP BY Wizards.wizard_name;"

  let query2 = "SELECT * FROM Houses;";

  db.pool.query(query1, function (error, rows, fields) {
    // Execute the query
    let Wizards = rows;

    db.pool.query(query2, (error, rows, fields) => {
      let Houses = rows;
      return res.render("../views/wizards.hbs", { data: Wizards, Houses: Houses });
    });
  }); // an object where 'data' is equal to the 'rows' we
}); 

// DELETE WIZARD ROW
app.delete('/delete-wizard-ajax/', function(req,res){                                                                
    let data = req.body;
    let wizardID = parseInt(data.wizard_id);
    let deleteQuery= `DELETE FROM Wizards WHERE wizard_id = ${wizardID}`;
  
    // Run the  query
    db.pool.query(deleteQuery, function(error, rows, fields){
    // handle error
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204)
        }
  })});

// ADD NEW WIZARD
app.post("/add-wizard-ajax", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  // Capture NULL values
  let wizard_graduated = parseInt(data.wizard_graduated);
  if (isNaN(wizard_graduated)) {
    wizard_graduated = "NULL";
  }

  let wizard_house = data.wizard_house;
  if (isNaN(wizard_house)) {
    wizard_house = "NULL";
  }

  console.log("wizard house:", wizard_house)

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
      query2 = `SELECT Wizards.wizard_id, Wizards.wizard_name, Wizards.wizard_graduated, Houses.house_name FROM Wizards, Houses WHERE Wizards.wizard_house = Houses.house_id GROUP BY Wizards.wizard_name;`;
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

// UPDATE WIZARD
app.put('/put-wizard-ajax', function(req,res){                                   
    let data = req.body;
    let wizardID = data.wizard_id
    let wizardGraduated = data.wizard_graduated
    let wizardHouse = data.wizard_house
    console.log("data values:", wizardID, wizardGraduated, wizardHouse)

    queryUpdate = `UPDATE Wizards SET wizard_graduated = ${wizardGraduated}, wizard_house = ${wizardHouse} WHERE wizard_id = ${wizardID}`;

    //first query
    db.pool.query(queryUpdate, function(error, rows, fields){
        // handle error
        if (error) {
            console.log(error)
            res.sendStatus(400)
        } else{
            // second query
            selectWizards = "SELECT * FROM Wizards"

            db.pool.query(selectWizards, function(error, row, fields){
                // handle error
                if (error){
                    console.log(error)
                    res.sendStatus(400)
                } else{
                    res.send(rows)
                }
            })
        }
    })
  
})


// ******* Spells Page *******
app.get("/spells", function (req, res) {

    let selectSpells = `SELECT S.spell_id, S.spell_name, S.spell_description, T.type_name
    FROM Spells S
    JOIN Type_Of_Spells TS ON S.spell_id = TS.spell_id
    JOIN Types T ON TS.type_id = T.type_id;`
    
    let selectTypes = `SELECT type_name, type_description FROM Types;`
  
    db.pool.query(selectSpells, function (error, rows, fields) {
      // Execute first query
      let Spells = rows;

      db.pool.query(selectTypes, function (erorr, rows, fields){
        let Types = rows;

        return res.render("../views/spells.hbs", { data: Spells, types: Types});
      })
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
