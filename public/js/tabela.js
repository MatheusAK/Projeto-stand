//Esse arquivo fará as requisições e funções do operador para manipular os dados do banco de dados.

document.addEventListener("DOMContentLoaded", async () => {

    const container = document.getElementById("tabelas");
    const resposta = await fetch("/api/horarios");
    const horarios = await resposta.json();
    const resposta2 = await fetch("/api/solicitacoes");
    const solicitacoes = await resposta2.json();
    console.log(horarios);

    const dias = [...new Set(
        horarios.map(horario => horario.dia)
    )];

    const horariosPorDia = dias.map(dia => {
        return {
            dia: dia,
            horarios: horarios.filter(horario => horario.dia === dia)
        };
    });

    dias.forEach(dia => {
        const divTabela = document.createElement("div");
        divTabela.classList.add("tabela");
        container.appendChild(divTabela);

        const title = document.createElement("h2");
        title.textContent = dia;
        divTabela.appendChild(title);

        const table = document.createElement("table");
        table.id = `tabela-${dia}`;
        table.classList.add("tabela");
        divTabela.appendChild(table);

        const thead = document.createElement("thead");
        table.appendChild(thead);
        const trHead = document.createElement("tr");
        thead.appendChild(trHead);

        const thHorario = document.createElement("th");
        thHorario.textContent = "Horários";
        trHead.appendChild(thHorario);

        const thocupante = document.createElement("th");
        thocupante.textContent = "Ocupante";
        trHead.appendChild(thocupante);

        const tbody = document.createElement("tbody");
        table.appendChild(tbody);

    });



    horariosPorDia.forEach(horario => {
        const tbody = document.querySelector(`#tabela-${horario.dia} tbody`);

        horario.horarios.forEach(item => {
            const trbody = document.createElement("tr");
            tbody.appendChild(trbody);

            const tdHorario = document.createElement("td");
            tdHorario.textContent = item.hora; // confirme o nome do campo
            trbody.appendChild(tdHorario);

            const tdOcupante = document.createElement("td");
            solicitacoes.forEach(solicitacao => {
                if (solicitacao.id_horario == item.id_horario && solicitacao.status !== "Pendente") {
                    tdOcupante.textContent = (`${tdOcupante.textContent} ${solicitacao.pessoa};`);
                }
            });
            trbody.appendChild(tdOcupante);
        });
    });
}); // Carreega a planilha de horários do operador ao carregar a página.