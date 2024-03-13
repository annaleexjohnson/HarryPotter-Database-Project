-- CS391-400-W2024 GROUP 78 DATA MANIPULATION QUERIES
-- By Regina Sanchez & Annalee Johnson
-- includes all the queries required to implement functionality
-- : = user input
-- TOS = Type_Of_Spells


-----------------------------------------
-- WIZARDS PAGE 
-----------------------------------------

-- display all wizard's ids, names, graduation status, and the names of their Hogwarts house
SELECT W.wizard_id, W.wizard_name, W.wizard_graduated, H.house_name
	FROM Wizards W
    JOIN Houses H ON W.wizard_house = H.house_id
  	GROUP BY W.wizard_name
    ORDER BY W.wizard_id;

-- create a new wizard
INSERT INTO Wizards (wizard_name, wizard_graduated, wizard_house) 
    VALUES (:wizard_name, :wizard_graduated, :wizard_house_id);

-- delete a wizard based on their id
DELETE FROM Wizards WHERE wizard_id = :wizard_id_input;

-- update a wizard (name, grad., house) based on wizard id
UPDATE Wizards SET
  wizard_name = :wizard_name,
  wizard_graduated = :wizard_graduated, 
  wizard_house = :wizard_house_id
  WHERE wizard_id = wizard_id


-----------------------------------------
-- HOUSES PAGE 
-----------------------------------------
-- display all house's id, name, and founder
SELECT * FROM Houses;

-- insert new house and house founder
INSERT INTO Houses (house_name, house_founder) 
    VALUES (:house_name_input, :house_founder_input);

-- delete house based on id
DELETE FROM Houses WHERE house_id = :house_id_input;


-----------------------------------------
-- SPELLS PAGE 
-- note: involves Spells, Type_Of_Spells (TOS), and Types table
-----------------------------------------

-- get all rows from Spells table
SELECT * FROM Spells;

-- displays spell_id and matching type_id, as well as type name
SELECT 
    T.type_id as t_type_id, T.type_name as t_type_name,     -- get Types columns
    TS.type_id as ts_type_id, TS.spell_id as ts_spell_id    -- get TOS columns
    FROM Type_Of_Spells TS 
    JOIN Types T on T.type_id = TS.type_id;                 -- join Types and TOS

-- get all types from Types table for dynamic dropdown
SELECT type_id, type_name, type_description FROM Types;

-- add new spell to Spells table (handles name and description)
INSERT INTO Spells (spell_name, spell_description) VALUES (:spell_name, :spell_description);

-- add new spell id and matching type id to TOS table 
-- note: handles spell type only since a spell can have multiple types
INSERT INTO Type_Of_Spells (spell_id, type_id) VALUES
  (
    -- gets spell id based on spell name
      (SELECT spell_id FROM Spells WHERE spell_name = :spell_name_input),   
      :spell_type_id
  );

-- delete spell from Spells table based on id
DELETE FROM Spells WHERE spell_id = ${spellID};

-- delete from TOS 
DELETE FROM Type_Of_Spells WHERE
    spell_id = :spell_id_input AND
    -- gets type id based on type name 
    type_id = (SELECT Type_Of_Spells.type_id 
                FROM Type_Of_Spells
                JOIN Types on Types.type_id = Type_Of_Spells.type_id
                WHERE Types.type_name = :type_name_input
                LIMIT 1);

-- delete spell from TOS table
DELETE FROM Type_Of_Spells WHERE spell_id = :spell_id AND type_id = :type_id;


-----------------------------------------
-- UPDATE SPELLS PAGE 
-----------------------------------------

-- displays spell name & description based on spell id
SELECT S.spell_id, S.spell_name, S.spell_description, T.type_name
  FROM Spells S
  JOIN Type_Of_Spells TS ON S.spell_id = :spell_id_input
  JOIN Types T ON TS.type_id = T.type_id
  WHERE TS.spell_id = :spell_id_input

-- displays spell types(s) from TOS based on spell id
SELECT T.type_id as t_type_id, T.type_name as t_type_name,
  TS.type_id as ts_type_id, TS.spell_id as ts_spell_id 
  FROM Type_Of_Spells TS 
  JOIN Types T on T.type_id = TS.type_id
  WHERE TS.spell_id = (SELECT spell_id from Spells WHERE spell_id = :spell_id_input);

-- gets Types for dynamic dropdown
SELECT type_id, type_name, type_description FROM Types;

-- update spell name and description in Spells table
UPDATE Spells SET 
    spell_name = :spell_name_input, 
    spell_description = :spell_description_input 
    WHERE spell_id = :spell_id

-- update spell type(s) in TOS table
UPDATE Type_Of_Spells SET type_id = ${newTypeID}
    WHERE spell_id = :spell_id_input AND type_id = :type_id_input


-----------------------------------------
-- TYPES PAGE 
-----------------------------------------

-- display all type's id, name, and description
SELECT * FROM Types;

-- insert new type
INSERT INTO Types (type_name, type_description) 
    VALUE (:type_name_input, :type_description_input)

-- delete type 
-- note: Types has the property ON DELETE SET NULL)
    -- deleting a type will remove the relationship in TOS by setting the TOS.type_id column null
DELETE FROM Types WHERE type_id = :type_id_input;


-----------------------------------------
-- (SPELL) INSTANCES PAGE 
-----------------------------------------

-- display instance id, wizard name, spell name, and any notes
SELECT SI.instance_id, S.spell_name, W.wizard_name, SI.notes
  FROM Spell_Instances SI
  JOIN Spells S ON SI.spell_id = S.spell_id
  JOIN Wizards W ON SI.wizard_id = W.wizard_id
  ORDER BY SI.instance_id ASC;

-- get all wizards
SELECT * FROM Wizards

-- get all spells
SELECT * FROM Spells

-- add spell instance
INSERT INTO Spell_Instances (spell_id, wizard_id, notes) VALUES 
    (
        -- get spell id based on spell name
        (SELECT spell_id FROM Spells WHERE spell_name = :spell_name_input),
        -- get wizard id based on wizard name
        (SELECT wizard_id FROM Wizards WHERE wizard_name = :wizard_name_input), 
        :instance_notes_input
    );

-- delete spell instance based on id
DELETE FROM Spell_Instances WHERE instance_id = :instance_id;


-----------------------------------------
-- UPDATE (SPELL) INSTANCES PAGE 
-----------------------------------------

-- display spell instance id, spell name, wizard name, and any notes based on id
SELECT SI.instance_id, S.spell_name, W.wizard_name, SI.notes
  FROM Spell_Instances SI
  JOIN Spells S ON SI.spell_id = S.spell_id
  JOIN Wizards W ON SI.wizard_id = W.wizard_id
  WHERE SI.instance_id = :instance_id;

-- get wizards for dropdown
SELECT * FROM Wizards;

-- get spells for dropdown
SELECT * FROM Spells;

-- update spell instance based on instance id
UPDATE Spell_Instances SET
    -- gets spell id based on spell name
    spell_id = (SELECT spell_id FROM Spells WHERE spell_name = :spell_name_input),
    -- gets wizard id based on wizard name
    wizard_id = (SELECT wizard_id FROM Wizards WHERE wizard_name = :wizard_name_input),
    notes = :instance_notes_input
    WHERE instance_id = :instance_id;