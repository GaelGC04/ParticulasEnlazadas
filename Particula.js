class Particula {
    // Se contruye la particula con estos parámetros
    constructor(x, y, tamanio, color, velocidad, tiempoVida=(100 + Math.random() * 500)) {
        this.x = x;
        this.y = y;
        this.tamanio = tamanio;
        this.color = color;
        this.velocidad = velocidad;
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
            this.velocidad.x *= 0.95;
        }
        if (this.velocidad.y > velocidadMaxima || this.velocidad.y < -velocidadMaxima) {
            this.velocidad.y *= 0.95;
        }
        
        // Se hace la interacción con el mouse si está activo
        if (mouseActivo) {
            if (mouse.x && mouse.y) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < distanciaMouse) {
                    const forceDirection = {
                        x: dx / distance,
                        y: dy / distance
                    };
                    const force = (distanciaMouse - distance) / 50;
                    
                    this.velocidad.x += forceDirection.x * force;
                    this.velocidad.y += forceDirection.y * force;
                }
            }
        }
        
        // Se llama a la función dibujar para que se dibuje la partícula en el canvas
        this.dibujar(contexto);
    }
}

export default Particula;