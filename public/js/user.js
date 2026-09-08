// Esse arquivo fará as requisições de dados do banco sem alterar os dados,
// apenas para o usuário visualizar os horários disponíveis.

const selectDia = document.getElementById("dia");
const selectHorario = document.getElementById("horario");
const buttonEnviar = document.getElementById("enviar");

// Guarda os horários buscados uma única vez, pra reaproveitar
// no filtro por dia sem precisar refazer a requisição a cada troca.
let horariosCache = [];

document.addEventListener("DOMContentLoaded", async () => {
    const resposta = await fetch("/api/horarios");
    horariosCache = await resposta.json();

    // Pega somente os dias existentes
    const dias = [...new Set(
        horariosCache.map(horario => horario.dia)
    )];

    // Cria uma option para cada dia
    dias.forEach(dia => {
        const option = document.createElement("option");

        option.value = dia;
        option.textContent = dia;

        selectDia.appendChild(option);
    });
});

selectDia.addEventListener("change", () => {
    // Limpa os horários anteriores
    selectHorario.innerHTML = `
        <option value="">Selecione um horário</option>
    `;

    // Filtra pelo dia selecionado, usando o cache já buscado
    const horariosDoDia = horariosCache.filter(
        horario => horario.dia === selectDia.value
    );

    // Cria as options
    horariosDoDia.forEach(horario => {
        const option = document.createElement("option");

        option.value = horario.id_horario;
        option.textContent = horario.hora;

        selectHorario.appendChild(option);
    });

    // Libera o select de horário, que começa travado no HTML
    selectHorario.disabled = false;
});

buttonEnviar.addEventListener("click", async () => {

    try {
        const resposta = await fetch(`/api/solicitacoes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pessoa: nome.value, id_horario: selectHorario.value })
        });
        alert("Solicitação Enviada!O irmão responsável vai adicionar seu nome na tabela em breve.");

        if (!resposta.ok) {
            throw new Error(`Erro ao enviar solicitação: ${resposta.status}`);
        }

        location.reload();

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível enviar a solicitação. Tente novamente.");
    }
});