addEventListener("DOMContentLoaded", async () => {
    const resposta = await fetch("/api/solicitacoes");
    const solicitacoes = await resposta.json();

    const container = document.getElementById("card-solicitacoes");
    const containerPendentes = document.getElementById("card-solicitacoes-pendentes");

    solicitacoes.forEach(solicitacao => {
        const card = document.createElement("div");
        card.classList.add("card-solicitacao");

        const pendente = solicitacao.status === "Pendente";

        card.innerHTML = `
            <div class="card-pessoa">
                <span class="card-valor">${solicitacao.pessoa}</span>
            </div>

            <div class="card-horario">
                <span class="card-valor">#${solicitacao.id_horario}</span>
            </div>

            <div class="card-status status-${solicitacao.status.toLowerCase()}">
                <span class="card-valor">${solicitacao.status}</span>
            </div>

            ${pendente ? `
            <div class="card-acoes">
                <button class="btn-aceitar" data-id="${solicitacao.id_solicitacao}">Aceitar</button>
                <button class="btn-recusar" data-id="${solicitacao.id_solicitacao}">Recusar</button>
            </div>
            ` : ""}
        `;

        if (pendente) {
            containerPendentes.appendChild(card);
        } else {
            container.appendChild(card);
        }
    });

    containerPendentes.addEventListener("click", async (event) => {
        const botao = event.target.closest(".btn-aceitar, .btn-recusar");
        if (!botao) return; // clique não foi em nenhum dos dois botões, ignora

        const id = botao.dataset.id;
        const novoStatus = botao.classList.contains("btn-aceitar") ? "Aceito" : "Recusado";

        try {
            const resposta = await fetch(`/api/solicitacoes/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: novoStatus })
            });

            if (!resposta.ok) {
                throw new Error(`Erro ao atualizar solicitação: ${resposta.status}`);
            }

            // reconsulta total: recarrega a lista do zero refletindo o novo status
            location.reload();
            // (ou, melhor, chamar de novo a função que faz o fetch + renderização,
            // se você tiver extraído isso pra uma função nomeada)

        } catch (erro) {
            console.error(erro);
            alert("Não foi possível atualizar a solicitação. Tente novamente.");
        }
    });

    const buttonReset = document.getElementById("button-reset")
    buttonReset.addEventListener("click", async () => {

    if (!confirm("⚠️Tem certeza que deseja APAGAR TODOS os nomes da lista?⚠️")) {
        return;
    }

    try {
        const resposta = await fetch("/api/solicitacoes", {
            method: "DELETE"
        });

        const resultado = await resposta.json();

        if (resultado.sucesso) {
            alert(`Solicitações apagadas: ${resultado.linhasApagadas}`);
            location.reload();
        } else {
            alert("Erro ao resetar solicitações.");
        }

    } catch (erro) {
        console.error(erro);
        alert("Erro de conexão com o servidor.");
    }
});
});

