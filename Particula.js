class Particula {
    // Se contruye la particula con estos parámetros
    constructor(x, y, tamanio, color, velocidad, friccion, fuerzaRepulsion, tiempoVida=(100 + Math.random() * 500)) {
        this.x = x;
        this.y = y;
        this.tamanio = tamanio;
        this.color = color;
        this.velocidad = velocidad;
        this.friccion = friccion;
        this.fuerzaRepulsion = fuerzaRepulsion;
        this.tiempoVida = tiempoVida;
    }

    dibujar(contexto) {
        contexto.save();
        contexto.globalAlpha = 1;
        contexto.fillStyle = this.color;
        contexto.beginPath();
        contexto.arc(this.x, this.y, this.tamanio, 0, Math.PI * 2);
        contexto.closePath();
        contexto.fill();
        contexto.restore();
    }

    actualizar(contexto, mouse, distanciaMouse, mouseActivo, velocidadMaxima) {
        this.x += this.velocidad.x;
        this.y += this.velocidad.y;

        // Se aplica fricción solo si es mayor a la velocidad máxima para regular la velocidad
        if (this.velocidad.x > velocidadMaxima || this.velocidad.x < -velocidadMaxima) {
            this.velocidad.x *= this.friccion;
        }
        if (this.velocidad.y > velocidadMaxima || this.velocidad.y < -velocidadMaxima) {
            this.velocidad.y *= this.friccion;
        }
        
        // Se hace la interacción con el mouse si está activo
        if (mouseActivo) {
            if (mouse.x && mouse.y) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distancia = Math.sqrt(dx * dx + dy * dy);
                
                if (distancia < distanciaMouse) {
                    const direccionFuerza = {
                        x: dx / distancia,
                        y: dy / distancia
                    };
                    const fuerza = (distanciaMouse - distancia) / (50 / (this.fuerzaRepulsion));
                    
                    this.velocidad.x += direccionFuerza.x * fuerza;
                    this.velocidad.y += direccionFuerza.y * fuerza;
                }
            }
        }
        
        // Se llama a la función dibujar para que se dibuje la partícula en el canvas
        this.dibujar(contexto);
    }
}

export default Particula;