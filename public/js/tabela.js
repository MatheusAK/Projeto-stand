document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("tabelas");
    const containerCards = document.getElementById("card-solicitacoes");
    const containerPendentes = document.getElementById("card-solicitacoes-pendentes");

    const resposta = await fetch("/api/horarios");
    const horarios = await resposta.json();

    const resposta2 = await fetch("/api/solicitacoes");
    const solicitacoes = await resposta2.json();

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

        const thOcupante = document.createElement("th");
        thOcupante.textContent = "Ocupante";
        trHead.appendChild(thOcupante);

        const tbody = document.createElement("tbody");
        table.appendChild(tbody);
    });

    horariosPorDia.forEach(grupo => {
        const tbody = document.querySelector(`#tabela-${grupo.dia} tbody`);

        grupo.horarios.forEach(item => {
            const trbody = document.createElement("tr");
            tbody.appendChild(trbody);

            const tdHorario = document.createElement("td");
            tdHorario.textContent = item.hora;
            tdHorario.setAttribute("value", item.id_horario);
            tdHorario.classList.add("tdHorario");
            trbody.appendChild(tdHorario);

            const tdOcupante = document.createElement("td");

            solicitacoes.forEach(solicitacao => {
                if (
                    solicitacao.id_horario == item.id_horario &&
                    solicitacao.status == "Aceito"
                ) {
                    tdOcupante.textContent += `${solicitacao.pessoa}; `;
                }
            });

            trbody.appendChild(tdOcupante);
        });
    });

    solicitacoes.forEach(solicitacao => {
        const card = document.createElement("div");
        card.classList.add("card-solicitacao");

        const pendente = solicitacao.status === "Pendente";

        const horario = horarios.find(
            horario => horario.id_horario == solicitacao.id_horario
        );

        const hora = horario ? horario.hora : "Horário não encontrado";
        const dia = horario ? horario.dia : "Dia não encontrado";

        card.innerHTML = `
            <div class="card-pessoa">
                <span class="card-valor">${solicitacao.pessoa}</span>
            </div>

            <div class="card-horario">
                <span class="card-valor">${dia}</span>
                <span class="card-valor">${hora}</span>
            </div>

            <div class="card-status status-${solicitacao.status.toLowerCase()}">
                <span class="card-valor">${solicitacao.status}</span>
            </div>

            ${pendente ? `
                <div class="card-acoes">
                    <button class="btn-aceitar" data-id="${solicitacao.id_solicitacao}">
                        Aceitar
                    </button>

                    <button class="btn-recusar" data-id="${solicitacao.id_solicitacao}">
                        Recusar
                    </button>
                </div>
            ` : ""}
        `;

        if (pendente) {
            containerPendentes.appendChild(card);
        } else {
            containerCards.appendChild(card);
        }
    });
});