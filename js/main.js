// ===== CHARACTER CLASS =====
class MinecraftCharacter {
  constructor(name, colors, id, manager) {
    this.id = id;
    this.name = name;
    this.colors = colors;
    this.manager = manager;
    this.position = {
      x: Math.random() * (window.innerWidth - 100),
      y: 0,
    };
    this.velocity = {
      x: (Math.random() - 0.5) * 100,
      y: 0,
    };
    this.direction = this.velocity.x > 0 ? "right" : "left";
    this.isJumping = false;
    this.jumpProgress = 0;
    this.directionTimer = this.randomInterval(2000, 4000);
    this.jumpTimer = this.randomInterval(3000, 7000);
    this.element = null;
  }

  randomInterval(min, max) {
    return min + Math.random() * (max - min);
  }

  spawn(container) {
    // Create character element
    this.element = document.createElement("div");
    this.element.className = "character walking";
    this.element.dataset.id = this.id;

    // Add double-click event listener for removal
    this.element.addEventListener("dblclick", () => {
      this.manager.remove(this.id);
    });

    // Create name label
    const nameLabel = document.createElement("div");
    nameLabel.className = "name-label";
    nameLabel.textContent = this.name;

    // Create character parts
    const head = document.createElement("div");
    head.className = "char-head";
    head.style.backgroundColor = this.colors.skin;

    // Create eyes
    const leftEye = document.createElement("div");
    leftEye.className = "char-eye left";
    const rightEye = document.createElement("div");
    rightEye.className = "char-eye right";

    const body = document.createElement("div");
    body.className = "char-body";
    body.style.backgroundColor = this.colors.shirt;

    const armLeft = document.createElement("div");
    armLeft.className = "char-arm left";
    armLeft.style.backgroundColor = this.colors.skin;

    const armRight = document.createElement("div");
    armRight.className = "char-arm right";
    armRight.style.backgroundColor = this.colors.skin;

    const legLeft = document.createElement("div");
    legLeft.className = "char-leg left";
    legLeft.style.backgroundColor = this.colors.pants;

    const legRight = document.createElement("div");
    legRight.className = "char-leg right";
    legRight.style.backgroundColor = this.colors.pants;

    // Assemble character
    this.element.appendChild(nameLabel);
    this.element.appendChild(head);
    head.appendChild(leftEye);
    head.appendChild(rightEye);
    this.element.appendChild(body);
    this.element.appendChild(armLeft);
    this.element.appendChild(armRight);
    this.element.appendChild(legLeft);
    this.element.appendChild(legRight);

    // Add to container
    container.appendChild(this.element);

    // Initial render
    this.render();
  }

  update(deltaTime) {
    // Update direction timer
    this.directionTimer -= deltaTime * 1000;
    if (this.directionTimer <= 0) {
      this.velocity.x = (Math.random() - 0.5) * 100;
      this.direction = this.velocity.x > 0 ? "right" : "left";
      this.directionTimer = this.randomInterval(2000, 4000);
    }

    // Update jump timer
    this.jumpTimer -= deltaTime * 1000;
    if (this.jumpTimer <= 0 && !this.isJumping) {
      this.isJumping = true;
      this.jumpProgress = 0;
      this.jumpTimer = this.randomInterval(3000, 7000);
    }

    // Update jump state
    if (this.isJumping) {
      this.jumpProgress += deltaTime * 1.67;
      if (this.jumpProgress >= 1) {
        this.isJumping = false;
        this.jumpProgress = 0;
      }
    }

    // Update position
    this.position.x += this.velocity.x * deltaTime;

    // Boundary check
    const charWidth = (window.innerHeight * 0.1) / 3;
    if (this.position.x < 0) {
      this.position.x = 0;
      this.velocity.x = Math.abs(this.velocity.x);
      this.direction = "right";
    } else if (this.position.x > window.innerWidth - charWidth) {
      this.position.x = window.innerWidth - charWidth;
      this.velocity.x = -Math.abs(this.velocity.x);
      this.direction = "left";
    }
  }

  getJumpOffset() {
    if (!this.isJumping) return 0;

    // Parabolic arc: -4(x - 0.5)² + 1
    const progress = this.jumpProgress;
    const height = -4 * Math.pow(progress - 0.5, 2) + 1;
    const maxHeight = window.innerHeight * 0.08;

    return height * maxHeight;
  }

  render() {
    if (!this.element) return;

    // Calculate jump offset
    const jumpOffset = this.getJumpOffset();

    // Apply position transform
    let transform = `translate3d(${this.position.x}px, ${-jumpOffset}px, 0)`;

    // Flip character based on direction
    if (this.direction === "left") {
      transform += " scaleX(-1)";
    }

    this.element.style.transform = transform;

    // Counter-flip the name label to keep text readable
    const nameLabel = this.element.querySelector(".name-label");
    if (nameLabel) {
      if (this.direction === "left") {
        nameLabel.style.transform = "translateX(-50%) scaleX(-1)";
      } else {
        nameLabel.style.transform = "translateX(-50%)";
      }
    }

    // Update walking class
    if (Math.abs(this.velocity.x) > 1) {
      this.element.classList.add("walking");
    } else {
      this.element.classList.remove("walking");
    }
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

// ===== CHARACTER MANAGER =====
class CharacterManager {
  constructor() {
    this.characters = [];
    this.maxCharacters = 15;
    this.nextId = 1;
    this.container = document.getElementById("characters-container");
    this.storageKey = "minecraft-characters";
  }

  canSpawn() {
    return this.characters.length < this.maxCharacters;
  }

  spawn(name, colors) {
    if (!this.canSpawn()) {
      return null;
    }

    const character = new MinecraftCharacter(name, colors, this.nextId++, this);
    character.spawn(this.container);
    this.characters.push(character);
    this.updateCounter();
    this.saveCharacters();

    return character;
  }

  update(deltaTime) {
    this.characters.forEach((char) => char.update(deltaTime));
  }

  render() {
    this.characters.forEach((char) => char.render());
  }

  remove(id) {
    const index = this.characters.findIndex((char) => char.id === id);
    if (index !== -1) {
      const character = this.characters[index];
      character.destroy();
      this.characters.splice(index, 1);
      this.updateCounter();
      this.saveCharacters();
    }
  }

  updateCounter() {
    const counter = document.getElementById("char-count");
    if (counter) {
      counter.textContent = this.characters.length;
    }

    // Update button state
    const button = document.querySelector("#spawn-form button");
    if (button) {
      button.disabled = !this.canSpawn();
      button.textContent = this.canSpawn() ? "Add Character" : "Max Characters";
    }
  }

  saveCharacters() {
    try {
      const characterData = this.characters.map((char) => ({
        id: char.id,
        name: char.name,
        colors: char.colors,
      }));
      localStorage.setItem(this.storageKey, JSON.stringify(characterData));
    } catch (error) {
      console.warn("Failed to save characters to localStorage:", error);
    }
  }

  loadCharacters() {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (!storedData) return;

      const characterData = JSON.parse(storedData);
      if (!Array.isArray(characterData)) return;

      // Spawn each saved character
      characterData.forEach((data) => {
        if (data.id && data.name && data.colors) {
          const character = new MinecraftCharacter(
            data.name,
            data.colors,
            data.id,
            this
          );
          character.spawn(this.container);
          this.characters.push(character);
        }
      });

      // Update nextId to avoid conflicts
      if (this.characters.length > 0) {
        this.nextId = Math.max(...this.characters.map((char) => char.id)) + 1;
      }

      this.updateCounter();
    } catch (error) {
      console.warn("Failed to load characters from localStorage:", error);
    }
  }
}

// ===== GAME LOOP =====
class GameLoop {
  constructor(manager) {
    this.manager = manager;
    this.lastTime = 0;
    this.running = false;
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    this.loop();
  }

  loop = () => {
    if (!this.running) return;

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Update all characters
    this.manager.update(deltaTime);

    // Render all characters
    this.manager.render();

    // Request next frame
    requestAnimationFrame(this.loop);
  };

  stop() {
    this.running = false;
  }
}

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
  const manager = new CharacterManager();
  const gameLoop = new GameLoop(manager);

  // Load saved characters from localStorage
  manager.loadCharacters();

  // Form submission handler
  const form = document.getElementById("spawn-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!manager.canSpawn()) {
      alert("Maximum characters reached (15)!");
      return;
    }

    const name = document.getElementById("char-name").value.trim();
    const colors = {
      skin: document.getElementById("skin-color").value,
      shirt: document.getElementById("shirt-color").value,
      pants: document.getElementById("pants-color").value,
    };

    manager.spawn(name, colors);

    // Reset name field only
    document.getElementById("char-name").value = "";
    document.getElementById("char-name").focus();
  });

  // Start game loop
  gameLoop.start();

  // Handle window resize
  window.addEventListener("resize", () => {
    manager.render();
  });
});
