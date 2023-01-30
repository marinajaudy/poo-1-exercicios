-- Active: 1675095322307@@127.0.0.1@3306
CREATE TABLE videos(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    title TEXT NOT NULL,
    duration INTEGER NOT NULL,
    upload_date TEXT DEFAULT(DATETIME()) NOT NULL
);

SELECT * FROM videos;

DROP TABLE videos;

INSERT INTO videos (id, title, duration)
VALUES 
    ("v001", "Mulheres", 486),
    ("v002", "Paternidade", 1282)