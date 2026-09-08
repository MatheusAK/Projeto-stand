document.addEventListener("DOMContentLoaded", () => {

    const containerPendentes = document.getElementById("card-solicitacoes-pendentes");

    containerPendentes.addEventListener("click", async (event) => {
        const botao = event.target.closest(".btn-aceitar, .btn-recusar");

        if (!botao) return;

        const id = botao.dataset.id;

        const novoStatus = botao.classList.contains("btn-aceitar")
            ? "Aceito"
            : "Recusado";

        try {
            const resposta = await fetch(`/api/solicitacoes/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: novoStatus
                })
            });

            if (!resposta.ok) {
                throw new Error(`Erro ao atualizar solicitação: ${resposta.status}`);
            }

            location.reload();

        } catch (erro) {
            console.error(erro);
            alert("Não foi possível atualizar a solicitação. Tente novamente.");
        }
    });

    const buttonReset = document.getElementById("button-reset");
    if (buttonReset) {
        buttonReset.addEventListener("click", async () => {

            if (!confirm("⚠️ Tem certeza que deseja APAGAR TODOS os nomes da lista? ⚠️")) {
                return;
            }

            try {
                const resposta = await fetch("/api/solicitacoes", {
                    method: "DELETE"
                });

                if (!resposta.ok) {
                    throw new Error(`Erro ao apagar solicitações: ${resposta.status}`);
                }

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
    }
});