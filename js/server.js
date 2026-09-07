const express = require('express');
const database = require("better-sqlite3");

const app = express();
const db = new database("../db/stand-db.sqlite");
app.use(express.json());
app.use(express.static("../public"));



app.get("/api/horarios", (req, res) => {
    const horarios = db
        .prepare("SELECT * FROM horario")
        .all();

    res.json(horarios);
});

app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080");
});