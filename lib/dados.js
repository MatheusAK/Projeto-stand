const { get, put } = require("@vercel/blob");

const CAMINHO_DADOS = "dados.json";

const ESTRUTURA_VAZIA = {
    horarios: [],
    solicitacoes: []
};

async function lerDados() {
    try {
        const resultado = await get(CAMINHO_DADOS, {
            access: "private",
            useCache: false
        });

        if (!resultado || resultado.statusCode !== 200 || !resultado.stream) {
            return ESTRUTURA_VAZIA;
        }

        const texto = await new Response(resultado.stream).text();
        const dados = JSON.parse(texto);

        return {
            horarios: Array.isArray(dados.horarios)
                ? dados.horarios
                : [],
            solicitacoes: Array.isArray(dados.solicitacoes)
                ? dados.solicitacoes
                : []
        };

    } catch (erro) {
        console.error("Erro ao ler dados do Blob:", erro);
        throw erro;
    }
}

async function salvarDados(dados) {
    await put(
        CAMINHO_DADOS,
        JSON.stringify(dados, null, 2),
        {
            access: "private",
            addRandomSuffix: false,
            allowOverwrite: true,
            contentType: "application/json"
        }
    );
}

module.exports = {
    lerDados,
    salvarDados
};