-- These are our database manipulation queries for our project
-- this includes all the queries required to implement functionality
-- : = user input

---- Wizards Page ----

-- create a new wizard
INSERT INTO Wizards (wizard_name, wizard_graduated, wizard_house) VALUES (:wizardName, :wizardGraduated, (SELECT house_id FROM Houses WHERE house_name =:wizard_house));

-- display all wizards
SELECT Wizards.wizard_name, Wizards.wizard_graduated, Houses.house_name FROM Wizards, Houses WHERE Wizards.wizard_house = Houses.house_id GROUP BY Wizards.wizard_name;

-- delete a wizard NEED TO ADD IN ID FROM HTML PAGE
DELETE FROM Wizards WHERE wizard_name = :wizard_name_input;

-- update a wizard (name, grad., house)
UPDATE Wizards SET wizard_name = :new_wizard_name_input, wizard_graduated = :new_wizard_graduated_input, wizard_house = (SELECT house_id FROM Houses WHERE house_name = :new_wizard_house_input) WHERE wizard_id = (SELECT wizard_id from Wizards WHERE wizard_name = :original_wizard_name_input);`;

---- Houses Page ----
-- display all houses
SELECT house_name, house_founder FROM Houses;

-- insert new house and house founder
INSERT INTO Houses (house_name, house_founder) VALUES (:house_name, :house_founder);


---- Spells Page ----

-- Add new spell 
    -- adding also adds to the Type_Of_Spells table using spell_id and type_id from Type select option
-- inserts into Spells table
INSERT INTO Spells (spell_name, spell_description) VALUES (:spell_name_input, :spell_desc_input);
-- inserts into Type_Of_Spells table
INSERT INTO Type_Of_Spells (spell_id, type_id) VALUES
    (
        (SELECT spell_id FROM Spells WHERE spell_name = :spell_name_input),
        (SELECT type_id FROM Types WHERE type_name = :type_name_input)
    )

-- display all spells (name, desc, type)
SELECT S.spell_name, S.spell_description, T.type_name
FROM Spells S
JOIN Type_Of_Spells TS ON S.spell_id = TS.spell_id
JOIN Types T ON TS.type_id = T.type_id;

-- delete spell (and TOS relationship)
DELETE FROM Spells WHERE spell_name = :spell_name_input
DELETE FROM Type_Of_Spells WHERE 
    spell_id = (SELECT spell_id FROM Spells where spell_name = :spell_name_input)
    and
    type_id = (SELECT type_id FROM Types where type_name = :type_name_input);

-- update Spells table
UPDATE Spells SET spell_name = :spell_name_input, spell_description = :spell_description_input WHERE id = :spell_id_from_page
-- update Type_Of_Spells table
UPDATE Type_Of_Spells SET 
	type_id = (SELECT type_id FROM Types WHERE type_name = :type_name_input),
    spell_id = (SELECT spell_id FROM Spells WHERE spell_name = :spell_name_input)
    WHERE spell_id = (SELECT spell_id FROM Spells WHERE spell_name = :spell_name_input)


---- Types ----
-- insert new type
INSERT INTO Types (type_name, type_description) VALUE (:type_name, :type_description)
-- select : display all types
SELECT type_name, type_description FROM Types;
-- delete type
DELETE FROM Types WHERE id = :type_id_selected_from_type_page


----- Spell Instances ----

-- select: display spell, wizard who used it, notes
SELECT S.spell_name, W.wizard_name, SI.notes
FROM Spell_Instances SI
JOIN Spells S ON SI.spell_id = S.spell_id
JOIN Wizards W ON SI.wizard_id = W.wizard_id;

-- delete spell instance
DELETE FROM Spell_Instances WHERE instance_id = :instance_id_input_from_si_page

-- insert new spell instance
INSERT INTO Spell_Instances WHERE (spell_id, wizard_id, notes) VALUES (:spell_id_input, :wizard_id_input, :notes_input)

-- update change spell / wizard
UPDATE Spell_Instances SET spell_id = :spell_id_input_from_si_page, wizard_id = wizard_id_input_from_si_page, notes = notes_input_from_si_page WHERE id = :spell_instances_page