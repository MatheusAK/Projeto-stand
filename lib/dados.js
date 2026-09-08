const { put, head } = require("@vercel/blob");

// Nome fixo do arquivo dentro do Blob Storage — sempre o mesmo,
// pra sempre sobrescrever o mesmo "banco" em vez de criar um novo a cada save.
const CAMINHO_DADOS = "dados.json";

// Estrutura inicial, usada só na primeira vez que o projeto roda
// (antes de existir qualquer dado salvo no Blob).
const ESTRUTURA_VAZIA = { horarios: [], solicitacoes: [] };

async function lerDados() {
    try {
        const info = await head(CAMINHO_DADOS);
        const resposta = await fetch(info.url);
        return await resposta.json();
    } catch (erro) {
        // head() lança erro se o blob ainda não existir —
        // nesse caso, começamos do zero.
        return ESTRUTURA_VAZIA;
    }
}

async function salvarDados(dados) {
    await put(CAMINHO_DADOS, JSON.stringify(dados), {
        access: "public",
        addRandomSuffix: false, // mantém a URL sempre igual
        allowOverwrite: true,   // permite sobrescrever o mesmo arquivo
        contentType: "application/json",
    });
}

module.exports = { lerDados, salvarDados };
