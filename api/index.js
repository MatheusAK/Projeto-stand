const express = require("express");
const { lerDados, salvarDados } = require("../lib/dados");

const app = express();
app.use(express.json());

// Não precisa mais de express.static aqui — na Vercel, os arquivos
// que não estão dentro de /api são servidos automaticamente como
// estáticos, sem passar por essa função.

app.get("/api/horarios", async (req, res) => {
    const dados = await lerDados();
    res.json(dados.horarios);
});

app.get("/api/solicitacoes", async (req, res) => {
    const dados = await lerDados();
    res.json(dados.solicitacoes);
});

app.patch("/api/solicitacoes/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const statusValidos = ["Aceito", "Pendente", "Recusado"];
    if (!statusValidos.includes(status)) {
        return res.status(400).json({ erro: "Status inválido." });
    }

    const dados = await lerDados();
    const solicitacao = dados.solicitacoes.find(
        (s) => String(s.id_solicitacao) === String(id)
    );

    if (!solicitacao) {
        return res.status(404).json({ erro: "Solicitação não encontrada." });
    }

    solicitacao.status = status;
    await salvarDados(dados);

    res.json({ sucesso: true });
});

app.post("/api/solicitacoes", async (req, res) => {
    const { pessoa, id_horario } = req.body;

    if (!pessoa || !id_horario) {
        return res.status(400).json({
            erro: "Campos 'pessoa' e 'id_horario' são obrigatórios.",
        });
    }

    const dados = await lerDados();

    // Substitui o autoincrement do SQLite: pega o maior id existente e soma 1.
    const proximoId = dados.solicitacoes.length
        ? Math.max(...dados.solicitacoes.map((s) => s.id_solicitacao)) + 1
        : 1;

    const novaSolicitacao = {
        id_solicitacao: proximoId,
        pessoa,
        id_horario,
        status: "Pendente",
    };

    dados.solicitacoes.push(novaSolicitacao);
    await salvarDados(dados);

    res.status(201).json(novaSolicitacao);
});

app.delete("/api/solicitacoes", async (req, res) => {
    const dados = await lerDados();
    const linhasApagadas = dados.solicitacoes.length;

    dados.solicitacoes = [];
    await salvarDados(dados);

    // Como o próximo id é sempre "maior id atual + 1", zerar o array
    // já reseta a contagem sozinho — não precisa de um equivalente
    // ao DELETE FROM sqlite_sequence.
    res.json({ sucesso: true, linhasApagadas });
});

// Não tem mais app.listen(): a Vercel invoca essa função por requisição,
// não existe processo escutando porta continuamente.
module.exports = app;
