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
  let selectSpells = `SELECT * FROM Spells;`;

  let selectTypes = `SELECT type_id, type_name, type_description FROM Types;`;

  // jons types and tos table
  let selectTOS = `SELECT T.type_id as t_type_id, T.type_name as t_type_name,
  TS.type_id as ts_type_id, TS.spell_id as ts_spell_id 
  FROM Type_Of_Spells TS 
  JOIN Types T on T.type_id = TS.type_id;`;

  db.pool.query(selectSpells, function (error, rows, fields) {
    // Execute first query
    let Spells = rows;

    db.pool.query(selectTypes, function (erorr, rows, fields) {
      let Types = rows;

      db.pool.query(selectTOS, function (erorr, rows, fields) {
        let TOS = rows;
        return res.render("../views/spells.hbs", {
          data: Spells,
          types: Types,
          tos: TOS,
        });
      });
    });
  });
});

// RENDER UPDATE SPELL PAGE
app.get("/updateSpell/:spellID", function (req, res) {
  let spellID = parseInt(req.params.spellID);

  let selectSpell = `SELECT S.spell_id, S.spell_name, S.spell_description, T.type_name
  FROM Spells S
  JOIN Type_Of_Spells TS ON S.spell_id = ${spellID}
  JOIN Types T ON TS.type_id = T.type_id
  WHERE TS.spell_id = ${spellID};`;

  let selectTypes = `SELECT type_id, type_name, type_description FROM Types;`;

  let selectSpellType = `SELECT T.type_id as t_type_id, T.type_name as t_type_name,
  TS.type_id as ts_type_id, TS.spell_id as ts_spell_id 
  FROM Type_Of_Spells TS 
  JOIN Types T on T.type_id = TS.type_id
  WHERE TS.spell_id = (SELECT spell_id from Spells WHERE spell_id = ${spellID});`;

  // select spell name and description
  db.pool.query(selectSpell, function (err, rows, fields) {
    let Spell = rows[0];

    // select all types from type table
    db.pool.query(selectTypes, function (err, rows, fields) {
      let Types = rows;

      // select spell types
      db.pool.query(selectSpellType, function (err, rows, fields) {
        return res.render("../views/updateSpell.hbs", {
          spell: Spell,
          types: Types,
          spellType: rows,
        });
      });
    });
  });
});

// UPDATE SPELL NAME AND DESCRIPTION
app.put("/put-spell-ajax", function (req, res) {
  let data = req.body;
  let spellID = parseInt(data.spell_id);
  let spellName = data.spell_name;
  let spellDesc = data.spell_desc;

  // updates name and description in Spells table
  let updateSpell = `UPDATE Spells SET 
    spell_name = '${spellName}', 
    spell_description = '${spellDesc}' 
    WHERE spell_id = ${spellID}`;

  // select current spell name & desc
  let selectSpell = `SELECT spell_name, spell_description 
  FROM Spells 
  WHERE spell_id = ${spellID};`;

  // update spells table
  db.pool.query(updateSpell, function (error, rows, fields) {
    // handle error
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      // select spell name and desc
      db.pool.query(selectSpell, function (err, rows, fields) {
        if (err) {
          console.log(err);
          res.sendStatus(400);
        } else {
          res.send(rows);
        }
      });
    }
  });
});

// UPDATE SPELL TYPE
app.put("/put-spell-type-ajax", function (req, res) {
  let data = req.body;
  let spellID = data.spell_id;
  let initTypeID = data.init_type_id;
  let newTypeID = parseInt(data.new_type_id);

  let updateQuery = `UPDATE Type_Of_Spells SET 
	  type_id = ${newTypeID}
    WHERE spell_id = ${spellID} AND type_id = ${initTypeID};`;

  // update TOS table
  db.pool.query(updateQuery, function (error, rows, fields) {
    // handle error
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

// ADD SPELL TYPE
app.post("/post-spell-type-ajax/", function (req, res) {
  let data = req.body;
  let spellID = parseInt(data.spell_id);
  let typeID = parseInt(data.spell_type);

  // deleting from spells will delete on cascade
  let insertTOS = `INSERT INTO Type_Of_Spells(spell_id, type_id) VALUES (${spellID}, ${typeID});`;

  // add to spells table
  db.pool.query(insertTOS, function (error, rows, fields) {
    // handle error
    if (error) {
      console.log(error);
      res.status(400).send(error.code);
    } else {
      res.sendStatus(200);
    }
  });
});

// DELETE SPELL TYPE
app.delete("/delete-spell-type-ajax/", function (req, res) {
  let data = req.body;
  let spellID = data.spell_id;
  let typeID = data.type_id;

  // deleting from spells will delete on cascade
  let deleteTOS = `DELETE FROM Type_Of_Spells WHERE spell_id = ${spellID} AND type_id = ${typeID}`;

  // delete from spells table
  db.pool.query(deleteTOS, function (error, rows, fields) {
    // handle error
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
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

/* 
*******************************
  SPELL INSTANCES PAGE
*******************************
*/

// GET ALL INSTANCES (AND/OR SEARCH RESULTS)
app.get("/instances", function (req, res) {
  // select al instances
  selectInstance = `SELECT SI.instance_id, S.spell_name, W.wizard_name, SI.notes
  FROM Spell_Instances SI
  JOIN Spells S ON SI.spell_id = S.spell_id
  JOIN Wizards W ON SI.wizard_id = W.wizard_id
  ORDER BY SI.instance_id ASC;`;
  // select wizards
  selectWizards = `SELECT * FROM Wizards`;
  // select spells
  selectSpells = `SELECT * FROM Spells`;

  // get all instances
  db.pool.query(selectInstance, function (err, rows) {
    let Instances = rows;
    // get all wizards
    db.pool.query(selectWizards, function (err, rows) {
      let Wizards = rows;
      // get all spells
      db.pool.query(selectSpells, function (err, rows) {
        let Spells = rows;
        // get all search results
        return res.render("../views/instances.hbs", {
          instances: Instances,
          wizards: Wizards,
          spells: Spells,
        });
      });
    });
  });
});

// ADD INSTANCE
app.post("/add-instance-ajax", function (req, res) {
  let data = req.body;
  let spellName = data.spell_name;
  let wizardName = data.wizard_name;
  let notes = data.notes;

  let addInstance = `INSERT INTO Spell_Instances (spell_id, wizard_id, notes) 
  VALUES (
      (SELECT spell_id FROM Spells WHERE spell_name='${spellName}'),
      (SELECT wizard_id FROM Wizards WHERE wizard_name='${wizardName}'), 
      '${notes}'	
  );`;

  let selectInstance = `SELECT SI.instance_id, S.spell_name, W.wizard_name, SI.notes
  FROM Spell_Instances SI
  JOIN Spells S ON SI.spell_id = S.spell_id
  JOIN Wizards W ON SI.wizard_id = W.wizard_id
  WHERE W.wizard_name= '${wizardName}' and S.spell_name = '${spellName}';`;

  // add instance
  db.pool.query(addInstance, function (err, rows) {
    if (err) {
      console.log(err);
      res.sendStatus(400);
    } else {
      // get all instances
      db.pool.query(selectInstance, function (err, rows) {
        if (err) {
          console.log(err);
          res.sendStatus(400);
        } else {
          console.log(rows);
          res.send(rows);
        }
      });
    }
  });
});

/*
*********************************
HOUSES PAGE
*********************************
*/

// get all houses
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

app.post("/add-type-ajax", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  // Create the query and run it on the database
  let query1 = `INSERT INTO Types (type_name, type_description) VALUE ('${data.typeName}', '${data.typeDesc}')`;

  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      query2 = `SELECT * FROM Types;`;
      db.pool.query(query2, function (error, rows, fields) {
        // If there was an error on the second query, send a 400
        if (error) {
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

// DELETE SPELL ROW
app.delete("/delete-type-ajax", function (req, res) {
  let data = req.body;
  let typeID = data.type_id;

  // For types table, on delete set null
  let deleteType = `DELETE FROM Types WHERE type_id = ${typeID};`;

  // delete from types table
  db.pool.query(deleteType, function (error, rows, fields) {
    // handle error
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
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
