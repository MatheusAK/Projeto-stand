addEventListener("DOMContentLoaded", async () => {
    const resposta = await fetch("/api/solicitacoes");
    const solicitacoes = await resposta.json();
    console.log(solicitacoes);
});