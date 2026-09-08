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

app.get("/api/solicitacoes", (req, res) => {
    const solicitacoes = db
        .prepare("SELECT * FROM solicitacoes")
        .all();
        console.log(solicitacoes);

    res.json(solicitacoes);
});

app.patch("/api/solicitacoes/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // validação básica — o CHECK do banco também protege, mas validar aqui
    // evita chegar até o banco com um erro que dá pra pegar antes
    const statusValidos = ["Aceito", "Pendente", "Recusado"];
    if (!statusValidos.includes(status)) {
        return res.status(400).json({ erro: "Status inválido." });
    }

    try {
        const stmt = db.prepare(
            "UPDATE solicitacoes SET status = ? WHERE id_solicitacao = ?"
        );
        const resultado = stmt.run(status, id);

        if (resultado.changes === 0) {
            // nenhuma linha foi afetada = esse id não existe
            return res.status(404).json({ erro: "Solicitação não encontrada." });
        }

        res.json({ sucesso: true });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao atualizar solicitação." });
    }
});

app.post("/api/solicitacoes", (req, res) => {
    const { pessoa, id_horario } = req.body;

    if (!pessoa || !id_horario) {
        return res.status(400).json({ erro: "Campos 'pessoa' e 'id_horario' são obrigatórios." });
    }

    try {
        const stmt = db.prepare(
            "INSERT INTO solicitacoes (pessoa, id_horario, status) VALUES (?, ?, ?)"
        );
        const resultado = stmt.run(pessoa, id_horario, "Pendente");

        res.status(201).json({
            id_solicitacao: resultado.lastInsertRowid,
            pessoa,
            id_horario,
            status: "Pendente"
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao criar solicitação." });
    }
});



app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080");
});