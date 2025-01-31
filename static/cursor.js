const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const maxParticles = 100;
const radius = 100;  // Distancia en la que se conectan las partículas

// Crear partículas aleatorias
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 1;
        this.speedY = Math.random() * 1 - 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Agregar partículas al array
for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
}

// Objeto del cursor
const mouse = {
    x: null,
    y: null
};

window.addEventListener("mousemove", (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Dibujar líneas cuando el cursor esté cerca
function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < radius) {
                ctx.strokeStyle = 'rgba(255, 255, 255, ${1 - distance / radius})';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }

        // Conectar con el cursor
        let dxMouse = particles[i].x - mouse.x;
        let dyMouse = particles[i].y - mouse.y;
        let distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distanceMouse < radius) {
            ctx.strokeStyle = 'rgba(255, 255, 255, ${1 - distanceMouse / radius})';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
    }
}

// Animación del canvas
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle) => {
        particle.update();
        particle.draw();
    });

    connectParticles();
    requestAnimationFrame(animate);
}

animate();
