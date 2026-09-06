const nome = document.getElementById("nome");
const dia = document.getElementById("dia");
const horario = document.getElementById("horario");
const enviar = document.getElementById("enviar");

dia.addEventListener("change", function () {
    if (dia.value !== "") {
        horario.disabled = false;
    } else {
        horario.disabled = true;
    }
});

const inputs = document.querySelectorAll("input, select");

inputs.forEach(function (input) {
    input.addEventListener("input", function () {
        if (dia.value === "" || horario.value === "" || nome.value === "") {
            enviar.disabled = true;
            enviar.classList.remove("button");
            enviar.classList.add("button-disabled");
        } else {
            enviar.disabled = false;
            enviar.classList.remove("button-disabled");
            enviar.classList.add("button");
        }
    });
});
