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

app.engine(
  ".hbs",
  engine({
    extname: ".hbs",
    helpers: { eq: (a, b) => a === b }, //equality helper block function
  })
);

app.set("view engine", ".hbs"); // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Database
var db = require("./database/db-connector");

/*
   ROUTES
*/
// app.js

/* 
*******************************
  HOME PAGE
*******************************
*/
app.get("/", function (req, res) {
  return res.render("index");
});

/* 
*******************************
  WIZARDS PAGE
*******************************
*/

//DISPLAY ALL WIZARD ROWS
app.get("/wizards", function (req, res) {
  let query1 =
    "SELECT Wizards.wizard_id, Wizards.wizard_name, Wizards.wizard_graduated, Houses.house_name FROM Wizards, Houses WHERE Wizards.wizard_house = Houses.house_id GROUP BY Wizards.wizard_name;";

  let query2 = "SELECT * FROM Houses;";

  db.pool.query(query1, function (error, rows, fields) {
    // Execute the query
    let Wizards = rows;

    db.pool.query(query2, (error, rows, fields) => {
      let Houses = rows;
      return res.render("../views/wizards.hbs", {
        data: Wizards,
        Houses: Houses,
      });
    });
  }); // an object where 'data' is equal to the 'rows' we
});

// DELETE WIZARD ROW
app.delete("/delete-wizard-ajax/", function (req, res) {
  let data = req.body;
  let wizardID = parseInt(data.wizard_id);
  let deleteQuery = `DELETE FROM Wizards WHERE wizard_id = ${wizardID}`;

  // Run the  query
  db.pool.query(deleteQuery, function (error, rows, fields) {
    // handle error
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

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

  console.log("wizard house:", wizard_house);

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
app.put("/put-wizard-ajax", function (req, res) {
  let data = req.body;
  let wizardID = data.wizard_id;
  let wizardGraduated = data.wizard_graduated;
  let wizardHouse = data.wizard_house;
  console.log("data values:", wizardID, wizardGraduated, wizardHouse);

  queryUpdate = `UPDATE Wizards SET wizard_graduated = ${wizardGraduated}, wizard_house = ${wizardHouse} WHERE wizard_id = ${wizardID}`;

  //first query
  db.pool.query(queryUpdate, function (error, rows, fields) {
    // handle error
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      // second query
      selectWizards = "SELECT * FROM Wizards";

      db.pool.query(selectWizards, function (error, row, fields) {
        // handle error
        if (error) {
          console.log(error);
          res.sendStatus(400);
        } else {
          res.send(rows);
        }
      });
    }
  });
});

/* 
*******************************
  SPELLS PAGE
*******************************
*/

// GET ALL SPELLS
app.get("/spells", function (req, res) {
  let selectSpells = `SELECT S.spell_id, S.spell_name, T.type_name, S.spell_description
    FROM Spells S
    JOIN Type_Of_Spells TS ON S.spell_id = TS.spell_id
    JOIN Types T ON TS.type_id = T.type_id
    ORDER BY S.spell_name ASC`;

  let selectTypes = `SELECT type_id, type_name, type_description FROM Types;`;

  db.pool.query(selectSpells, function (error, rows, fields) {
    // Execute first query
    let Spells = rows;

    db.pool.query(selectTypes, function (erorr, rows, fields) {
      let Types = rows;
      return res.render("../views/spells.hbs", { data: Spells, types: Types });
    });
  });
});

// ADD NEW SPELL
app.post("/add-spell-ajax", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;
  let spellName = data.spell_name;
  let spellDesc = data.spell_desc;
  let spellType = parseInt(data.spell_type);

  // insert into spells tables
  let insertSpell = `INSERT INTO Spells (spell_name, spell_description) VALUES ('${spellName}', '${spellDesc}');`;
  // insert into TOS tables
  let insertTypeOfSpell = `INSERT INTO Type_Of_Spells (spell_id, type_id) VALUES
  (
      (SELECT spell_id FROM Spells WHERE spell_name = '${spellName}'),
      ${spellType}
  );`;
  // select all spells
  let selectSpell = `SELECT S.spell_id, S.spell_name, S.spell_description, T.type_name
  FROM Spells S
  JOIN Type_Of_Spells TS ON S.spell_id = TS.spell_id
  JOIN Types T ON TS.type_id = T.type_id
  ORDER BY S.spell_id;`;

  // add to spells table
  db.pool.query(insertSpell, function (err, rows) {
    if (err) {
      console.log("error adding spell");
      return res.sendStatus(400);
    } else {
      // add to type of spells table
      db.pool.query(insertTypeOfSpell, function (err, rows) {
        if (err) {
          console.log("error adding to tos");
          return res.sendStatus(400);
        } else {
          // select all spells from table and return rows
          db.pool.query(selectSpell, function (err, rows) {
            if (err) {
              console.log("error selecting spells");
              return res.sendStatus(400);
            } else {
              return res.send(rows);
            }
          });
        }
      });
    }
  });
});

// DELETE SPELL ROW
app.delete("/delete-spell-ajax/", function (req, res) {
  let data = req.body;
  let spellID = parseInt(data.spell_id);
  let typeName = data.type_name;

  // deleting from spells will delete on cascade
  let deleteSpell = `DELETE FROM Spells WHERE spell_id = ${spellID};`;
  // delete from TOS
  let deleteTOS = `DELETE FROM Type_Of_Spells WHERE
                      spell_id = ${spellID} AND
                      type_id = (SELECT Type_Of_Spells.type_id 
                                  FROM Type_Of_Spells
                                  JOIN Types on Types.type_id = Type_Of_Spells.type_id
                                  WHERE Types.type_name = '${typeName}'
                                  LIMIT 1);`;

  // delete from spells table
  db.pool.query(deleteSpell, function (error, rows, fields) {
    // handle error
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      // delete from TOS table
      db.pool.query(deleteTOS, function (error, rows, fields) {
        if (error) {
          console.log(error);
          res.sendStatus(400);
        } else {
          res.sendStatus(204);
        }
      });
    }
  });
});

// RENDER UPDATE SPELL PAGE
app.get("/updateSpell/:spellID", function (req, res) {
  let spellID = parseInt(req.params.spellID);

  console.log(typeof spellID);

  let selectSpell = `SELECT S.spell_id, S.spell_name, S.spell_description, T.type_name
  FROM Spells S
  JOIN Type_Of_Spells TS ON S.spell_id = ${spellID}
  JOIN Types T ON TS.type_id = T.type_id
  WHERE TS.spell_id = ${spellID};`;

  let selectTypes = `SELECT type_id, type_name, type_description FROM Types;`;

  db.pool.query(selectSpell, function (err, rows, fields) {
    let Spell = rows[0];
    console.log(Spell);
    db.pool.query(selectTypes, function (err, rows, fields) {
      let Types = rows;
      console.log(Spell);
      return res.render("../views/updateSpell.hbs", {
        spell: Spell,
        types: Types,
      });
    });
  });
});

// UPDATE SPELL ROW
app.put("/put-spell-ajax", function (req, res) {
  let data = req.body;
  let spellID = parseInt(data.spell_id);
  let spellName = data.spell_name;
  let spellDesc = data.spell_desc;
  let spellType = parseInt(data.spell_type);
  let initialType = data.initial_type;

  // updates name and description in Spells table
  let updateSpell = `UPDATE Spells SET 
    spell_name = '${spellName}', 
    spell_description = '${spellDesc}' 
    WHERE spell_id = ${spellID}`;

  // updates type of spell in TOS  table (null values allowed)
  let updateTOS = `UPDATE Type_Of_Spells SET 
      type_id = (SELECT type_id FROM Types WHERE type_id = ${spellType}),
      spell_id = (SELECT spell_id FROM Spells WHERE spell_id = ${spellID})
      WHERE 
      spell_id = (SELECT spell_id FROM Spells WHERE spell_id = ${spellID}) 
      AND 
      type_id = (SELECT type_id FROM Types WHERE type_id = ${initialType});`;

  // update spells table
  db.pool.query(updateSpell, function (error, rows, fields) {
    // handle error
    // console.log("update spells query:", updateSpell)
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      // update TOS table
      db.pool.query(updateTOS, function (error, row, fields) {
        // console.log("update tos query:", updateTOS)
        // handle error
        if (error) {
          console.log(error);
          res.sendStatus(400);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});

/* 
*******************************
  SPELL INSTANCES PAGE
*******************************
*/

// GET ALL SPELLS
app.get("/instances", function (req, res) {
  selectInstance = `SELECT SI.instance_id, S.spell_name, W.wizard_name, SI.notes
  FROM Spell_Instances SI
  JOIN Spells S ON SI.spell_id = S.spell_id
  JOIN Wizards W ON SI.wizard_id = W.wizard_id;`;

  db.pool.query(selectInstance, function (err, rows) {
    console.log(rows);
    return res.render("../views/instances.hbs", {
      instances: rows,
    });
  });
});

/*
*********************************
HOUSES PAGE
*********************************
*/

// get all houses
// ********* Houses Page ************
app.get("/houses", function (req, res) {
  let query1 = "SELECT * FROM Houses;"; // Define our query

  db.pool.query(query1, function (error, rows, fields) {
    // Execute the query

    res.render("../views/houses.hbs", { data: rows }); // Render the index.hbs file, and also send the renderer
  }); // an object where 'data' is equal to the 'rows' we
});

app.post("/add-house-ajax", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  // Create the query and run it on the database
  query1 = `INSERT INTO Houses (house_name, house_founder) VALUES ('${data.house_name}', '${data.house_founder}')`;
  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    } else {
      // If there was no error, perform a SELECT * on bsg_people
      query2 = `SELECT * FROM Houses;`;
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
*******************************
  TYPES PAGE
*******************************
*/

// GET ALL types
app.get("/types", function (req, res) {
  let query1 = "SELECT * FROM Types;"; // Define our query

  db.pool.query(query1, function (error, rows, fields) {
    // Execute the query

    res.render("../views/types.hbs", { data: rows }); // Render the index.hbs file, and also send the renderer
  }); // an object where 'data' is equal to the 'rows' we
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
