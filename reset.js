document.addEventListener("DOMContentLoaded", () => {
    const buttonReset = document.getElementById("button-reset");
    buttonReset.addEventListener("click", async () => {
        console.log("AAAAAAAAAAAAAA")

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
});