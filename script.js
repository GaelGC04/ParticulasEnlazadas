import RedParticulas from './RedParticulas.js';

document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('contenedorParticulas');
    const velocidadMaxima = 0.5;
    const nParticulas = 800;
    const generarParticulasFuera = false;
    const crearParticulaOnClick = false;
    const mouseActivo = true;
    const mouseParticula = true;
    const distanciaMouse = 150;
    const distanciaMaximaConexiones = 100;
    const distanciaMouseConexiones = 160;
    const anchoLinea = 0.8;
    const colorFondo = '20,00,15';
    const colorConexiones = '255, 255, 255';
    const tamanioParticulas = 4;
    const friccion = 0.95;
    const fuerzaRepulsion = 1;
    const tamanioMinimoParticulas = 0.5;
    const colores = ['#4CBBFC', '#4CFCB1', '#FC4C4C', '#FCFC4C', '#FC4CFC'];
    let rp = new RedParticulas(
        contenedor,
        velocidadMaxima,
        nParticulas,
        generarParticulasFuera,
        crearParticulaOnClick,
        mouseActivo,
        mouseParticula,
        distanciaMouse,
        distanciaMaximaConexiones,
        distanciaMouseConexiones,
        anchoLinea,
        colorFondo,
        colorConexiones,
        tamanioParticulas,
        friccion,
        fuerzaRepulsion,
        tamanioMinimoParticulas,
        colores
    );

    document.addEventListener('click', (e) => {
        if (rp) {
            rp.crearParticula(e.clientX, e.clientY);
        }
    });
});