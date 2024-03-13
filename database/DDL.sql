SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;
DROP TABLE IF EXISTS Houses;
DROP TABLE IF EXISTS Wizards;
DROP TABLE IF EXISTS Types;
DROP TABLE IF EXISTS Spells;
DROP TABLE IF EXISTS Type_Of_Spells;
DROP TABLE IF EXISTS Spell_Instances;

-- Create table to store Hogwarts Wizard Houses
CREATE OR REPLACE TABLE Houses (
    house_id INT(11) AUTO_INCREMENT PRIMARY KEY,
    house_name VARCHAR(45) NOT NULL,
    house_founder VARCHAR(45) NOT NULL,
    CONSTRAINT UQ_house UNIQUE (house_id, house_name, house_founder)
);


-- Create table to store wizards & their demographics
CREATE OR REPLACE TABLE Wizards (
    wizard_id INT(11) AUTO_INCREMENT PRIMARY KEY,
    wizard_name VARCHAR(45) NOT NULL,
    wizard_graduated TINYINT NOT NULL DEFAULT 0,
    wizard_house INT DEFAULT NULL,
    FOREIGN KEY (wizard_house) REFERENCES Houses(house_id) -- add the wizard's Hogwart's house
    ON DELETE SET NULL 		-- if a house is deleted, set column to null  
);

-- Create table to store different classifications of spells
CREATE OR REPLACE TABLE Types (
    type_id INT(11) AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(45) NOT NULL,
    type_description VARCHAR(255) DEFAULT "",
    CONSTRAINT UQ_type UNIQUE (type_id, type_name)  -- each type must be unique 
);


-- Create table to store spells and corresponding info
CREATE OR REPLACE TABLE Spells (
    spell_id INT(11) AUTO_INCREMENT PRIMARY KEY,
    spell_name VARCHAR(45) NOT NULL,
    spell_description VARCHAR(255) DEFAULT "",
    CONSTRAINT UQ_spell UNIQUE (spell_id, spell_name)  -- each spell must be unique 
);


-- Create intersection table to store spells and their type classification
CREATE OR REPLACE TABLE Type_Of_Spells (
	tos_id INT(11) AUTO_INCREMENT,
    spell_id INT(11) NOT NULL,
    type_id INT(11) DEFAULT NULL, 
    
    -- PK is combo of tos_id and spell_id
    PRIMARY KEY(tos_id, spell_id),
    
    FOREIGN KEY(spell_id) REFERENCES Spells(spell_id) ON DELETE CASCADE,
    FOREIGN KEY(type_id) REFERENCES Types(type_id)ON DELETE SET NULL
);


-- Create transaction table to store instances where a wizard used a spell
CREATE OR REPLACE TABLE Spell_Instances (
    instance_id INT(11) AUTO_INCREMENT UNIQUE,
    spell_id INT(11) NOT NULL,
    wizard_id INT(11) NOT NULL,
    notes VARCHAR(255) DEFAULT "",
    PRIMARY KEY(instance_id),
    FOREIGN KEY(spell_id) REFERENCES Spells(spell_id) ON DELETE CASCADE,        -- if spell is deleted, remove record of spell instance
    FOREIGN KEY(wizard_id) REFERENCES Wizards(wizard_id) ON DELETE CASCADE      -- if wizard is deleted, remove record of spell instance
);

-- DESCRIBE Houses;
-- DESCRIBE Wizards;
-- DESCRIBE Types;
-- DESCRIBE Spells;
-- DESCRIBE Type_Of_Spells;
-- DESCRIBE Spell_Instances;

-- Add all the Hogwarts houses and founders
INSERT INTO Houses (house_name, house_founder) VALUES
('Gryffindor', 'Godric Gryffindor'),
('Hufflepuff', 'Helga Hufflepuff'),
('Ravenclaw', 'Rowena Ravenclaw'),
('Slytherin', 'Salazar Slytherin');


-- Add sample data for various wizards
INSERT INTO Wizards (wizard_name, wizard_graduated, wizard_house) VALUES
('Harry Potter', 1, 1),
('Newton Scamander', 1, 2),
('Draco Malfoy', 1, 4),
('Sirius Black', 1, 1),
('Nymphadora Tonks', 1, 2);


-- Add all known types of spell classifications
INSERT INTO Types (type_name, type_description) VALUES
('Transfiguration', 'Alteration of the object''s form or appearance'),
('Charm', 'Alteration of the objects inherent qualities i.e. its behaviour and capabilities'),
('Jinx','Minor dark magic; spells whose effects were irritating but amusing, almost playful and of minor inconvenience to the target'),
('Hex','Consistently affected the object in a negative manner; had connotations of dark magic, but more so than a jinx'),
('Curse','The worst kind of dark magic, intended to affect the target in a strongly negative manner'),
('Counter-spell','Inhibition of the effect of another spell'),
('Healing spell','For improving the condition of a living, injured or ill target');


-- Add sample data for various spells
INSERT INTO Spells (spell_name, spell_description) VALUES
('Avis', 'conjuration that would produce a flock of birds'),
('Expelliarmus', 'the Disarming Charm, so-called because it would change its objects quality from armed to disarmed by separating them from their wand'),
('Impedimenta', 'the Impediment Jinx, which (appropriately) would impede the forward motion of an object'),
('Densaugeo', 'a hex that would horribly enlarge the targets teeth'),
('Avada Kedavra', 'Would instantly kill the target'),
('Episkey', 'used to heal minor injuries'),
('Finite Incantatem', 'used to terminate spell effects in general'),
('Ducklifors', 'Turned the target into a duck'),
('Incendio', 'Conjured a jet of flame'),
('Titillando', 'Tickled target and weakened'),
('Ascendio', 'used to lift the caster high into the air or propel them to the surface if they were underwater at the time'),
('Melofors', 'encased the victims head in a pumpkin'),
('Pestis Indendium', 'produced powerful enchanted flames of immense size and heat that were capable of destroying nearly anything and everything in its path');


-- Add sample data of spells and their types
INSERT INTO Type_Of_Spells (spell_id, type_id) VALUES
((SELECT spell_id FROM Spells WHERE spell_id = 1), (SELECT type_id FROM Types WHERE type_id = 1)),
((SELECT spell_id FROM Spells WHERE spell_id = 2), (SELECT type_id FROM Types WHERE type_id = 2)),
((SELECT spell_id FROM Spells WHERE spell_id = 3), (SELECT type_id FROM Types WHERE type_id = 3)),
((SELECT spell_id FROM Spells WHERE spell_id = 4), (SELECT type_id FROM Types WHERE type_id = 4)),
((SELECT spell_id FROM Spells WHERE spell_id = 5), (SELECT type_id FROM Types WHERE type_id = 5)),
((SELECT spell_id FROM Spells WHERE spell_id = 6), (SELECT type_id FROM Types WHERE type_id = 6)),
((SELECT spell_id FROM Spells WHERE spell_id = 7), (SELECT type_id FROM Types WHERE type_id = 7)),
((SELECT spell_id FROM Spells WHERE spell_id = 8), (SELECT type_id FROM Types WHERE type_id = 3)),
((SELECT spell_id FROM Spells WHERE spell_id = 9), (SELECT type_id FROM Types WHERE type_id = 1)),
((SELECT spell_id FROM Spells WHERE spell_id = 10), (SELECT type_id FROM Types WHERE type_id = 4)),
((SELECT spell_id FROM Spells WHERE spell_id = 11), (SELECT type_id FROM Types WHERE type_id = 2)),
((SELECT spell_id FROM Spells WHERE spell_id = 12), (SELECT type_id FROM Types WHERE type_id = 3)),
((SELECT spell_id FROM Spells WHERE spell_id = 12), (SELECT type_id FROM Types WHERE type_id = 1)),
((SELECT spell_id FROM Spells WHERE spell_id = 13), (SELECT type_id FROM Types WHERE type_id = 1)),
((SELECT spell_id FROM Spells WHERE spell_id = 13), (SELECT type_id FROM Types WHERE type_id = 5));


-- Add sample data of records of wizards who used a spell
INSERT INTO Spell_Instances (spell_id, wizard_id, notes) VALUES
(
    (SELECT spell_id FROM Spells WHERE spell_id = 11), 
    (SELECT wizard_id FROM Wizards WHERE wizard_id = 2), 
    'used this spell in September 1927 on a library record column in the library of the French Ministry of Magic in an attempt to help him, Porpentina Goldstein, and Leta Lestrange to escape from a pack of angry Matagots set upon them'
),
(
    (SELECT spell_id FROM Spells WHERE spell_id = 3), 
    (SELECT wizard_id FROM Wizards WHERE wizard_id = 1),
    'Used it in the maze during the Third Task of Triwizard Tournament'
),
(
    (SELECT spell_id FROM Spells WHERE spell_id = 4), 
    (SELECT wizard_id FROM Wizards WHERE wizard_id = 3),
    'On 13 November 1994, Hermione Granger was hit by this hex from Draco Malfoy''s wand. Draco and Harry Potter had begun fighting in the corridor, which eventually led to a duel, but the spells they cast at each other missed and hit Hermione and Gregory Goyle instead'
),
(
    (SELECT spell_id FROM Spells WHERE spell_id = 2), 
    (SELECT wizard_id FROM Wizards WHERE wizard_id = 4),
    'Used it to disarm both Harry Potter and Hermione Granger simultaneously in the Shrieking Shack.'
),    
(
    (SELECT spell_id FROM Spells WHERE spell_id = 6), 
    (SELECT wizard_id FROM Wizards WHERE wizard_id = 5),
    'Tonks used this spell to fix Harry Potter''s broken nose.'
);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;
