// Etape1
// Ciblez l'élèment avec l'id game-container et stockez le dans une variable canvas

const canvas = document.querySelector("#game-container");

// Modifier la largeur et la hauter de l'élèment  <canvas>
canvas.width = innerWidth;
canvas.height = innerHeight;

// Etape2
// Obtenir le context en utilisant la méthode getContext
const ctx = canvas.getContext("2d");

// Créer la class Entity
class Entity {
  // Déclarer un constructor qui prend en paramètres x, y radius et une propriété color de la class Entity initialisée à "red".
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = "red";
  }

  //Déclarer la méthode draw pour dessiner un disque à l'intérieur de la canvas
  draw() {
    ctx.beginPath();
    // La méthode arc crée un arc de cercle centré sur (x, y) avec un rayon de radius
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

    //La propriété fillStyle et la méthode fill nous permettent de remplir l'arc avec une couleur et l'arc devient un disque
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

// Déclarer une class Player qui hérite la class Entity
class Player extends Entity {
  constructor(x, y, radius, color) {
    super(x, y, radius);
    this.color = color;
  }
}

// on va créer une instance de la class Player
let player = new Player(canvas.width / 2, canvas.height / 2, 10, "red");
// appeler la méthode draw pour dessiner un disque
player.draw();

//Etape3
// Créer la class Projectile qui s'étend de la classe Player
class Projectile extends Player {
  // Déclarer un constructor qui prend en paramètres les coordonnées x et y, un radius et une color de la class Player
  // Créer une nouvelle propriété velocity
  constructor(x, y, radius, color, velocity) {
    super(x, y, radius, color);
    this.velocity = velocity;
  }
  // méthode pour mettre à jour la position du disque en ajoutant la vitesse aux coordonnées x et y
  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

// on va créer une instance de la class Projectile
const projectile = new Projectile(50, 50, 30, "blue", { x: 3, y: 3 });
projectile.draw();

// Ajouter un ecouteur d'événement sur window
// Déclarer un tableau projectiles pour garder une référence tous les projectiles que nous créons.
const projectiles = [];

window.addEventListener("click", (event) => {
  // Calculer l'angle entre le joueur et la position du curseur et stocker la dans une variable nommée angle.
  const angle = Math.atan2(event.clientY - player.y, event.clientX - player.x);
  // Calculer la velocity
  const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5,
  };

  const projectile = new Projectile(player.x, player.y, 5, "white", velocity);
  projectiles.push(projectile);
  projectile.draw();
});

class Enemy extends Projectile {
  constructor(x, y, radius, color, velocity) {
    super(x, y, radius, color, velocity);
  }
}

// déclarer un tableau enemies
const enemies = [];

// Animation
function animate() {
  requestAnimationFrame(animate);

  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  player.draw();

  projectiles.forEach((projectile) => projectile.update());

  enemies.forEach((enemy, enemyIndex) => {
    projectiles.forEach((projectile, projectileIndex) => {
      const distance = Math.hypot(
        projectile.x - enemy.x,
        projectile.y - enemy.y
      );
      if (distance - projectile.radius - enemy.radius <= 0) {
        enemies.splice(enemyIndex, 1);
        projectiles.splice(projectileIndex, 1);
      }
    });
    enemy.update();
  });
}
animate();

// créer des ennemies
function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4;

    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const color = `rgb(${r}, ${g}, ${b})`;

    const randomValue = Math.random();
    let x, y;
    if (randomValue < 0.25) {
      x = 0 - radius;
      y = Math.random() * canvas.height;
    } else if (randomValue >= 0.25 && randomValue < 0.5) {
      x = canvas.width + radius;
      y = Math.random() * canvas.height;
    } else if (randomValue >= 0.5 && randomValue < 0.75) {
      x = Math.random() * canvas.width;
      y = 0 - radius;
    } else if (randomValue >= 0.75) {
      x = Math.random() * canvas.width;
      y = canvas.height + radius;
    }

    const angle = Math.atan2(player.y - y, player.x - x);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 1000);
}
spawnEnemies();