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
  let selectWizards = `SELECT W.wizard_id, W.wizard_name, W.wizard_graduated, H.house_name
      FROM Wizards W
      LEFT JOIN Houses H ON W.wizard_house = H.house_id
      GROUP BY W.wizard_name
      ORDER BY W.wizard_id;`;

  let selectHouses = "SELECT * FROM Houses;";

  db.pool.query(selectWizards, function (error, rows, fields) {
    // Execute the query
    let Wizards = rows;

    db.pool.query(selectHouses, (error, rows, fields) => {
      let Houses = rows;
      return res.render("../views/wizards.hbs", {
        data: Wizards,
        Houses: Houses,
      });
    });
  }); // an object where 'data' is equal to the 'rows' we
});

// RENDER UPDATE WIZARD PAGE
app.get("/updateWizard/:wizardID", function (req, res) {
  let wizardID = parseInt(req.params.wizardID);

  let selectWizard = `SELECT W.wizard_id, W.wizard_name, W.wizard_graduated, H.house_name
  FROM Wizards W
  JOIN Houses H ON W.wizard_house = H.house_id
  WHERE W.wizard_id = ${wizardID};`;

  let selectHouses = `SELECT * FROM Houses;`;

  // get wizard
  db.pool.query(selectWizard, function (error, rows, fields) {
    let Wizard = rows[0];
    // handle error
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      // get houses
      db.pool.query(selectHouses, function (error, rows) {
        if (error) {
          console.log(error);
          res.sendStatus(400);
        } else {
          let Houses = rows;
          return res.render("../views/updateWizard.hbs", {
            wizard: Wizard,
            houses: Houses,
          });
        }
      });
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

  // Create the query and run it on the database
  query1 = `INSERT INTO Wizards (wizard_name, wizard_graduated, wizard_house) VALUES ('${data.wizard_name}', ${wizard_graduated}, ${wizard_house})`;

  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.send(rows);
    }
  });
});

// UPDATE WIZARD
app.put("/put-wizard-ajax", function (req, res) {
  let data = req.body;
  let wizardID = data.wizard_id;
  let wizardName = data.wizard_name;
  let wizardGraduated = parseInt(data.wizard_graduated);
  let wizardHouse = data.wizard_house;

  queryUpdate = `UPDATE Wizards SET
  wizard_name = '${wizardName}',
  wizard_graduated = ${wizardGraduated}, 
  wizard_house = ${wizardHouse} 
  WHERE wizard_id = ${wizardID}`;

  //first query
  db.pool.query(queryUpdate, function (error, rows, fields) {
    // handle error
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(200);
    }
  });
});

// DELETE WIZARD ROW
app.delete("/delete-wizard-ajax", function (req, res) {
  let data = req.body;
  let wizardID = data.wizard_id;

  // deleting from spells will delete on cascade
  let deleteWizard = `DELETE FROM Wizards WHERE wizard_id = ${wizardID};`;

  // delete from spells table
  db.pool.query(deleteWizard, function (error, rows, fields) {
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

  // get all rows from Spells
  db.pool.query(selectSpells, function (error, rows, fields) {
    let Spells = rows;
    // get all rows from Types
    db.pool.query(selectTypes, function (erorr, rows, fields) {
      let Types = rows;
      // join Types and TOS tables
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

// ADD NEW SPELL TO SPELLS TABLE
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

// UPDATE SPELL NAME AND DESCRIPTION IN SPELLS TABLE
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

// UPDATE SPELL TYPE IN TYPE_OF SPELLS
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

// ADD SPELL TYPE TO A CURRENT SPELL
app.post("/post-spell-type-ajax/", function (req, res) {
  let data = req.body;
  let spellID = parseInt(data.spell_id);
  let typeID = parseInt(data.spell_type);

  // inserts into TOS
  let insertTOS = `INSERT INTO Type_Of_Spells(spell_id, type_id) VALUES (${spellID}, ${typeID});`;

  // add to TOS table
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

// DELETE SPELL TYPE FROM A SPELL
app.delete("/delete-spell-type-ajax/", function (req, res) {
  let data = req.body;
  let spellID = data.spell_id;
  let typeID = data.type_id;

  let deleteTOS = `DELETE FROM Type_Of_Spells WHERE spell_id = ${spellID} AND type_id = ${typeID};`;

  // delete from TOS table
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

  // add instance
  db.pool.query(addInstance, function (err, rows) {
    if (err) {
      console.log(err);
      res.sendStatus(400);
    } else {
      res.sendStatus(200);
    }
  });
});

// DELETE INSTANCE ROW
app.delete("/delete-instance-ajax/", function (req, res) {
  let data = req.body;
  let instanceID = data.instance_id;

  // deleting from spells will delete on cascade
  let deleteInstance = `DELETE FROM Spell_Instances WHERE instance_id = ${instanceID};`;

  // delete from spells table
  db.pool.query(deleteInstance, function (error, rows, fields) {
    // handle error
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

// RENDER UPDATE SPELL INSTANCES PAGE
app.get("/updateInstance/:instanceID", function (req, res) {
  let instanceID = parseInt(req.params.instanceID);
  // select instance based on id
  let selectInstance = `SELECT SI.instance_id, S.spell_name, W.wizard_name, SI.notes
  FROM Spell_Instances SI
  JOIN Spells S ON SI.spell_id = S.spell_id
  JOIN Wizards W ON SI.wizard_id = W.wizard_id
  WHERE SI.instance_id = ${instanceID};`;
  // get all wizards and spells
  let selectWizards = `SELECT * FROM Wizards;`;
  let selectSpells = `SELECT * FROM Spells;`;

  // select instance
  db.pool.query(selectInstance, function (err, rows, fields) {
    let Instance = rows[0];

    // select wizards
    db.pool.query(selectWizards, function (err, rows, fields) {
      let Wizards = rows;

      // select spells
      db.pool.query(selectSpells, function (err, rows, fields) {
        return res.render("../views/updateInstance.hbs", {
          instance: Instance,
          wizards: Wizards,
          spells: rows,
        });
      });
    });
  });
});

// UPDATE INSTANCE ROW
app.put("/put-instance-ajax", function (req, res) {
  let data = req.body;
  let instanceID = data.instance_id;
  let wizardName = data.wizard_name;
  let spellName = data.spell_name;
  let notes = data.notes;

  let updateInstance = `UPDATE Spell_Instances SET
	  spell_id = (SELECT spell_id FROM Spells WHERE spell_name = '${spellName}'),
    wizard_id = (SELECT wizard_id FROM Wizards WHERE wizard_name = '${wizardName}'),
    notes = '${notes}'
    WHERE instance_id = ${instanceID};`;

  db.pool.query(updateInstance, function (err, rows) {
    if (err) {
      console.log(err);
      res.sendStatus(400);
    } else {
      res.sendStatus(200);
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

  // Execute the query
  db.pool.query(query1, function (error, rows, fields) {
    // render houses page
    res.render("../views/houses.hbs", { data: rows });
  });
});

// add new house
app.post("/add-house-ajax", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  // Create the query and run it on the database
  query1 = `INSERT INTO Houses (house_name, house_founder) VALUES ('${data.house_name}', '${data.house_founder}')`;

  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      return res.sendStatus(200);
    }
  });
});

// delete house
app.delete("/delete-house-ajax", function (req, res) {
  let data = req.body;
  let houseID = data.house_id;

  let deleteHouse = `DELETE FROM Houses WHERE house_id = ${houseID};`;

  db.pool.query(deleteHouse, function (err, rows) {
    if (err) {
      console.log(err);
      res.sendStatus(400);
    } else {
      return res.sendStatus(204);
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

  // Execute the query
  db.pool.query(query1, function (error, rows, fields) {
    // render types page
    res.render("../views/types.hbs", { data: rows });
  });
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
      res.sendStatus(200);
    }
  });
});

// DELETE TYPE ROW
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
