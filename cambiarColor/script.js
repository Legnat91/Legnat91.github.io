document.addEventListener('DOMContentLoaded', () => {

    const color = document.getElementById('color');
    const boton = document.getElementById('generar');


    function generarColor() {
        let variablesColores = '0123456789ABCDEF';
        let colorHEX = '#';


        for (let i = 0; i < 6; i++) {
            let indicadorAle =Math.floor(Math.random() * 16);
            colorHEX += variablesColores[indicadorAle];
        }
        return colorHEX;

    }


    boton.addEventListener('click', ()=>{
        let colorAleatorio=generarColor();

        color.textContent=colorAleatorio;

        document.body.style.backgroundColor=colorAleatorio;
    });







});
