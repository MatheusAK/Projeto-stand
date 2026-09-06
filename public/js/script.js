// const dia = document.getElementById("dia");

dia.addEventListener("change", async () => {
    if (dia.value === "quarta-feira") {

        const resposta = await fetch("/api/horarios");
        const horarios = await resposta.json();
        console.log("resposta: ", horarios);
    }
});