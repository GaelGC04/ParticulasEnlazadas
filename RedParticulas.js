import Particula from './Particula.js';

class RedParticulas {
    constructor(contenedor, velocidadMaxima, nParticulas, generarParticulasFuera, crearParticulaOnClick, mouseActivo, mouseParticula, distanciaMouse, distanciaMaximaConexiones, distanciaMouseConexiones, anchoLinea, colorFondo, colorConexiones, tamanioParticulas, friccion, fuerzaRepulsion, tamanioMinimoParticulas, colores) {
        this.contenedor = contenedor;
        this.contexto = contenedor.getContext('2d'); // Se da que hay un contexto de graficos 2D
        
        this.particulas = []; // Arreglo donde se guardan las particulas
        this.mouse = { x: null, y: null };
        
        this.crearParticulaOnClick = crearParticulaOnClick; // Se crea una partícula al hacer click
        this.mouseActivo = mouseActivo; // Mouse interactúa con las partículas
        this.mouseParticula = mouseParticula; // Mouse toma el lugar de una partícula, en caso de no, entonces repele
        this.distanciaMouse = distanciaMouse; // Distancia a la que el mouse afecta a las partículas
        this.distanciaMaximaConexiones = distanciaMaximaConexiones; // Distancia máxima para que las partículas se conecten entre sí
        this.distanciaMouseConexiones = distanciaMouseConexiones; // Distancia de dibujado de conexiones entre mouse y partículas

        this.colorFondo = colorFondo; // Color de fondo del canvas

        this.colores = colores; // Colores de partículas
        this.colorConexiones = colorConexiones; // Color de fondo del canvas
        this.anchoLinea = anchoLinea; // Ancho de la línea de conexión entre partículas
        
        this.tamanioParticulas = tamanioParticulas; // Tamaño de las partículas
        this.tamanioMinimoParticula = tamanioMinimoParticulas; // Tamaño mínimo de las partículas

        this.velocidadMaxima = velocidadMaxima; // Velocidad máxima de las partículas
        this.friccion = friccion; // Fricción de las partículas
        this.fuerzaRepulsion = fuerzaRepulsion; // Fuerza de repulsión del mouse
        this.nParticulas = nParticulas; // Número de partículas iniciales
        this.generarParticulasFuera = generarParticulasFuera; // Generar partículas fuera del canvas

        this.setup();
        this.animar();
    }

    setup() {
        this.redimensionar();
        window.addEventListener('resize', this.redimensionar.bind(this));
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
        
        for (let iteradorCreacion = 0; iteradorCreacion < this.nParticulas; iteradorCreacion++) {
            this.crearParticula();
        }
    }

    redimensionar() {
        this.contenedor.width = window.innerWidth;
        this.contenedor.height = window.innerHeight;
    }

    crearParticula(particula_x = Math.random() * this.contenedor.width, particula_y = Math.random() * this.contenedor.height) {
        // Se generan los datos para la partícula nueva
        const tamanio = this.tamanioMinimoParticula + (Math.random() * this.tamanioParticulas);
        const x = particula_x;
        const y = particula_y;
        const color = this.colores[Math.floor(Math.random() * this.colores.length)];
        const velocidad = {
            x: (Math.random() - 0.5) * this.velocidadMaxima * 2,
            y: (Math.random() - 0.5) * this.velocidadMaxima * 2
        };

        this.particulas.push(new Particula(x, y, tamanio, color, velocidad, this.friccion, this.fuerzaRepulsion));
    }

    animar() {
        requestAnimationFrame(this.animar.bind(this));
        
        // Limpiar canvas con un alpha para efecto de rastro
        this.contexto.fillStyle = `rgba(${this.colorFondo})`;
        this.contexto.fillRect(0, 0, this.contenedor.width, this.contenedor.height);

        // Dibujar conexiones entre partículas
        this.dibujarConexiones();
        
        // Actualizar y dibujar partículas
        for (let iteradorParticulas = 0; iteradorParticulas < this.particulas.length; iteradorParticulas++) {
            // Se actualizan las partículas del arreglo
            this.particulas[iteradorParticulas].actualizar(
                this.contexto,
                this.mouse,
                this.distanciaMouse,
                this.mouseActivo,
                this.velocidadMaxima
            );
            
            // Si la partícula sale del contenedor se elimina y se crea una nueva
            if (this.particulas[iteradorParticulas].x < this.contenedor.offsetLeft -this.distanciaMaximaConexiones/2 ||
                this.particulas[iteradorParticulas].x > this.contenedor.offsetLeft + this.contenedor.width + this.distanciaMaximaConexiones/2 ||
                this.particulas[iteradorParticulas].y < this.contenedor.offsetTop -this.distanciaMaximaConexiones/2 ||
                this.particulas[iteradorParticulas].y > this.contenedor.offsetTop + this.contenedor.height + this.distanciaMaximaConexiones/2) {
                this.particulas.splice(iteradorParticulas, 1);

                if (this.generarParticulasFuera == true) {
                    if (this.particulas.length < this.nParticulas) {
                        iteradorParticulas--;
                        const lado_generado = Math.random() < 0.5 ? 'x' : 'y';
                        let x_lado, y_lado, nuevo_x, nuevo_y;
                        if (lado_generado === 'x') {
                            x_lado = Math.random() < 0.5 ? 'r' : 'l';
                            if (x_lado === 'l') {
                                nuevo_x = this.contenedor.offsetLeft - this.distanciaMaximaConexiones/3;
                            } else {
                                nuevo_x = this.contenedor.offsetLeft + this.contenedor.width + this.distanciaMaximaConexiones/3;
                            }
                            nuevo_y = Math.random() * this.contenedor.height;
                        } else {
                            y_lado = Math.random() < 0.5 ? 't' : 'b';
                            if (y_lado === 't') {
                                nuevo_y = this.contenedor.offsetTop - this.distanciaMaximaConexiones/3;
                            } else {
                                nuevo_y = this.contenedor.offsetTop + this.contenedor.height + this.distanciaMaximaConexiones/3;
                            }
                            nuevo_x = Math.random() * this.contenedor.width;
                        }
                        this.crearParticula(nuevo_x, nuevo_y);
                    }
                } else {
                        this.crearParticula();
                }
            }
        }
    }

    dibujarConexiones() {
        for (let iteradorColumnas = 0; iteradorColumnas < this.particulas.length; iteradorColumnas++) {
            for (let iteradorFilas = iteradorColumnas + 1; iteradorFilas < this.particulas.length; iteradorFilas++) {
                // Se calcula la distancia entre las partículas
                const dx = this.particulas[iteradorColumnas].x - this.particulas[iteradorFilas].x;
                const dy = this.particulas[iteradorColumnas].y - this.particulas[iteradorFilas].y;
                const distancia = Math.sqrt(dx * dx + dy * dy);
                
                // Se dibuja la conexión entre las partículas
                if (distancia < this.distanciaMaximaConexiones) {
                    const opacity = 1 - distancia / this.distanciaMaximaConexiones;
                    this.contexto.strokeStyle = `rgba(${this.colorConexiones}, ${opacity})`;
                    this.contexto.lineWidth = this.anchoLinea;
                    this.contexto.beginPath();
                    this.contexto.moveTo(this.particulas[iteradorColumnas].x, this.particulas[iteradorColumnas].y);
                    this.contexto.lineTo(this.particulas[iteradorFilas].x, this.particulas[iteradorFilas].y);
                    this.contexto.stroke();
                }
            }

            if (this.mouseParticula) {
                if (this.mouse.x && this.mouse.y) {
                    const dx = this.particulas[iteradorColumnas].x - this.mouse.x;
                    const dy = this.particulas[iteradorColumnas].y - this.mouse.y;
                    const distancia = Math.sqrt(dx * dx + dy * dy);
                    if (distancia < this.distanciaMouseConexiones) {
                        const opacity = 1 - (distancia / this.distanciaMouseConexiones);
                        this.contexto.strokeStyle = `rgba(${this.colorConexiones}, ${opacity})`;
                        this.contexto.lineWidth = this.anchoLinea * 2;
                        this.contexto.beginPath();
                        this.contexto.moveTo(this.particulas[iteradorColumnas].x, this.particulas[iteradorColumnas].y);
                        this.contexto.lineTo(this.mouse.x, this.mouse.y);
                        this.contexto.stroke();
                    }
                }
            }

        }
    }
}

export default RedParticulas;