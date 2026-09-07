// Esse arquivo fará as requisições de dados do banco sem alterar os dados,
// apenas para o usuário visualizar os horários disponíveis.

const selectedia = document.getElementById("dia");
const selectHorario = document.getElementById("horario");

document.addEventListener("DOMContentLoaded", async () => {

    const selectDia = document.getElementById("dia");

    const resposta = await fetch("/api/horarios");
    const horarios = await resposta.json();

    // Pega somente os dias existentes
    const dias = [...new Set(
        horarios.map(horario => horario.dia)
    )];

    // Cria uma option para cada dia
    dias.forEach(dia => {
        const option = document.createElement("option");

        option.value = dia;
        option.textContent = dia;

        selectDia.appendChild(option);
    });
});

selectedia.addEventListener("change", async () => {
    // Busca os horários no backend
    const resposta = await fetch("/api/horarios");
    const horarios = await resposta.json();

    // Limpa os horários anteriores
    selectHorario.innerHTML = `
        <option value="">Selecione um horário</option>
    `;

    // Filtra pelo dia selecionado
    const horariosDoDia = horarios.filter(
        horario => horario.dia === selectedia.value
    );

    // Cria as options
    horariosDoDia.forEach(horario => {
        const option = document.createElement("option");

        option.value = horario.id_horario;
        option.textContent = horario.hora;

        selectHorario.appendChild(option);
    });
});