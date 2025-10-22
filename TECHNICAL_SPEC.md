# Technical Specification - Minecraft Character Simulator

## Component Breakdown

### 1. HTML Structure

```html
<body>
  <div id="world">
    <!-- Sky layer -->
    <div class="sky-layer"></div>

    <!-- Grass layer -->
    <div class="grass-layer"></div>

    <!-- Dirt layer -->
    <div class="dirt-layer"></div>

    <!-- Characters container -->
    <div id="characters-container"></div>
  </div>

  <!-- Control Panel -->
  <div id="control-panel">
    <h2>Spawn Character</h2>
    <form id="spawn-form">
      <label>Name: <input type="text" id="char-name" required /></label>
      <label
        >Skin: <input type="color" id="skin-color" value="#FFD9A0"
      /></label>
      <label
        >Shirt: <input type="color" id="shirt-color" value="#3498db"
      /></label>
      <label
        >Pants: <input type="color" id="pants-color" value="#2c3e50"
      /></label>
      <button type="submit">Add Character</button>
      <p class="counter"><span id="char-count">0</span>/15</p>
    </form>
  </div>
</body>
```

### 2. Character DOM Structure

Each spawned character:

```html
<div class="character" data-id="{uniqueId}" style="left: {x}px; bottom: {y}px;">
  <div class="name-label">{characterName}</div>
  <div class="char-head" style="background-color: {skinColor}"></div>
  <div class="char-body" style="background-color: {shirtColor}"></div>
  <div class="char-arm left" style="background-color: {skinColor}"></div>
  <div class="char-arm right" style="background-color: {skinColor}"></div>
  <div class="char-leg left" style="background-color: {pantsColor}"></div>
  <div class="char-leg right" style="background-color: {pantsColor}"></div>
</div>
```

### 3. CSS Architecture

#### Variables

```css
:root {
  --char-unit: calc(10vh / 12);
  --sky-color-top: #87ceeb;
  --sky-color-bottom: #4a90e2;
  --grass-color: #7ec850;
  --dirt-color: #8b4513;
}
```

#### World Layers

```css
#world {
  position: fixed;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.sky-layer {
  background: linear-gradient(
    to bottom,
    var(--sky-color-top),
    var(--sky-color-bottom)
  );
  height: 50%;
}

.grass-layer {
  background: var(--grass-color);
  height: 30%;
  position: relative;
  /* Add CSS pattern for grass texture */
}

.dirt-layer {
  background: var(--dirt-color);
  height: 20%;
  /* Add CSS pattern for dirt texture */
}
```

#### Character Dimensions

```css
.character {
  position: absolute;
  width: calc(var(--char-unit) * 4);
  height: calc(var(--char-unit) * 12);
  transition: transform 0.1s linear;
}

.char-head {
  width: calc(var(--char-unit) * 3);
  height: calc(var(--char-unit) * 3);
  position: absolute;
  top: 0;
  left: calc(var(--char-unit) * 0.5);
  border: 2px solid #000;
  box-shadow: inset -2px -2px 4px rgba(0, 0, 0, 0.3);
}

.char-body {
  width: calc(var(--char-unit) * 4);
  height: calc(var(--char-unit) * 6);
  position: absolute;
  top: calc(var(--char-unit) * 3);
  border: 2px solid #000;
  box-shadow: inset -2px -2px 4px rgba(0, 0, 0, 0.3);
}

.char-arm {
  width: calc(var(--char-unit) * 1);
  height: calc(var(--char-unit) * 5);
  position: absolute;
  top: calc(var(--char-unit) * 3);
  border: 2px solid #000;
  transform-origin: top center;
}

.char-arm.left {
  left: calc(var(--char-unit) * -1);
}

.char-arm.right {
  right: calc(var(--char-unit) * -1);
}

.char-leg {
  width: calc(var(--char-unit) * 1.5);
  height: calc(var(--char-unit) * 5);
  position: absolute;
  top: calc(var(--char-unit) * 9);
  border: 2px solid #000;
  transform-origin: top center;
}

.char-leg.left {
  left: calc(var(--char-unit) * 0.5);
}

.char-leg.right {
  right: calc(var(--char-unit) * 0.5);
}
```

#### Animation Keyframes

```css
@keyframes walk-left-arm {
  0%,
  100% {
    transform: rotate(-20deg);
  }
  50% {
    transform: rotate(20deg);
  }
}

@keyframes walk-right-arm {
  0%,
  100% {
    transform: rotate(20deg);
  }
  50% {
    transform: rotate(-20deg);
  }
}

@keyframes walk-left-leg {
  0%,
  100% {
    transform: rotate(20deg);
  }
  50% {
    transform: rotate(-20deg);
  }
}

@keyframes walk-right-leg {
  0%,
  100% {
    transform: rotate(-20deg);
  }
  50% {
    transform: rotate(20deg);
  }
}

.character.walking .char-arm.left {
  animation: walk-left-arm 0.6s infinite;
}

.character.walking .char-arm.right {
  animation: walk-right-arm 0.6s infinite;
}

.character.walking .char-leg.left {
  animation: walk-left-leg 0.6s infinite;
}

.character.walking .char-leg.right {
  animation: walk-right-leg 0.6s infinite;
}
```

### 4. JavaScript Architecture

#### Character Class

```javascript
class MinecraftCharacter {
  constructor(name, colors, id) {
    this.id = id;
    this.name = name;
    this.colors = colors; // {skin, shirt, pants}
    this.position = {
      x: Math.random() * (window.innerWidth - 100),
      y: 0,
    };
    this.velocity = {
      x: (Math.random() - 0.5) * 100, // -50 to 50 px/s
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
    // Create DOM element
    // Attach to container
    // Store reference
  }

  update(deltaTime) {
    // Update position
    // Check boundaries
    // Update timers
    // Trigger jumps
    // Change direction
  }

  render() {
    // Apply transforms
    // Update position
    // Update name label
  }

  destroy() {
    // Remove from DOM
    // Clean up references
  }
}
```

#### Character Manager

```javascript
class CharacterManager {
  constructor() {
    this.characters = [];
    this.maxCharacters = 15;
    this.nextId = 1;
    this.container = document.getElementById("characters-container");
  }

  canSpawn() {
    return this.characters.length < this.maxCharacters;
  }

  spawn(name, colors) {
    if (!this.canSpawn()) return null;

    const char = new MinecraftCharacter(name, colors, this.nextId++);
    char.spawn(this.container);
    this.characters.push(char);
    this.updateCounter();
    return char;
  }

  update(deltaTime) {
    this.characters.forEach((char) => char.update(deltaTime));
  }

  render() {
    this.characters.forEach((char) => char.render());
  }

  updateCounter() {
    document.getElementById("char-count").textContent = this.characters.length;
  }
}
```

#### Game Loop

```javascript
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

  loop() {
    if (!this.running) return;

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;

    // Update all characters
    this.manager.update(deltaTime);

    // Render all characters
    this.manager.render();

    // Request next frame
    requestAnimationFrame(() => this.loop());
  }

  stop() {
    this.running = false;
  }
}
```

### 5. Physics & Movement Logic

#### Movement Update Algorithm

```javascript
update(deltaTime) {
  // Update direction timer
  this.directionTimer -= deltaTime * 1000;
  if (this.directionTimer <= 0) {
    this.changeDirection();
    this.directionTimer = this.randomInterval(2000, 4000);
  }

  // Update jump timer
  this.jumpTimer -= deltaTime * 1000;
  if (this.jumpTimer <= 0 && !this.isJumping) {
    this.startJump();
    this.jumpTimer = this.randomInterval(3000, 7000);
  }

  // Update jump state
  if (this.isJumping) {
    this.jumpProgress += deltaTime * 1.67; // Complete in 0.6s
    if (this.jumpProgress >= 1) {
      this.isJumping = false;
      this.jumpProgress = 0;
    }
  }

  // Update position
  this.position.x += this.velocity.x * deltaTime;

  // Boundary check
  const charWidth = window.innerHeight * 0.1 / 3;
  if (this.position.x < 0) {
    this.position.x = 0;
    this.velocity.x = Math.abs(this.velocity.x);
    this.direction = 'right';
  } else if (this.position.x > window.innerWidth - charWidth) {
    this.position.x = window.innerWidth - charWidth;
    this.velocity.x = -Math.abs(this.velocity.x);
    this.direction = 'left';
  }
}
```

#### Jump Calculation

```javascript
getJumpOffset() {
  if (!this.isJumping) return 0;

  // Parabolic arc: -4 * (x - 0.5)^2 + 1
  // Normalized to 0-1, peaks at 0.5
  const normalizedProgress = this.jumpProgress;
  const height = -4 * Math.pow(normalizedProgress - 0.5, 2) + 1;
  const maxJumpHeight = window.innerHeight * 0.08; // 8% of viewport

  return height * maxJumpHeight;
}
```

### 6. Background Texture Patterns

#### CSS Grass Texture

```css
.grass-layer::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
      0deg,
      transparent 24%,
      rgba(255, 255, 255, 0.05) 25%,
      rgba(255, 255, 255, 0.05) 26%,
      transparent 27%,
      transparent 74%,
      rgba(255, 255, 255, 0.05) 75%,
      rgba(255, 255, 255, 0.05) 76%,
      transparent 77%,
      transparent
    ), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(
          255,
          255,
          255,
          0.05
        ) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(
          255,
          255,
          255,
          0.05
        ) 76%, transparent 77%, transparent);
  background-size: 50px 50px;
}
```

#### CSS Dirt Texture

```css
.dirt-layer::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(
      circle at 20% 20%,
      rgba(0, 0, 0, 0.2) 1%,
      transparent 1%
    ), radial-gradient(
      circle at 60% 40%,
      rgba(0, 0, 0, 0.2) 1%,
      transparent 1%
    ), radial-gradient(circle at 40% 70%, rgba(0, 0, 0, 0.2) 1%, transparent 1%);
  background-size: 30px 30px;
}
```

### 7. Form Handling

```javascript
function initializeForm() {
  const form = document.getElementById("spawn-form");
  const manager = new CharacterManager();

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
    form.reset();

    // Disable button if at max
    if (!manager.canSpawn()) {
      form.querySelector("button").disabled = true;
    }
  });
}
```

### 8. Performance Considerations

#### Optimization Techniques

1. **Use CSS transforms** instead of left/top for positioning
2. **RequestAnimationFrame** for 60fps smooth animation
3. **Delta time** for frame-independent movement
4. **CSS variables** for dynamic sizing
5. **will-change** property for animated elements
6. **Transform translate3d** to trigger GPU acceleration
7. **Minimize DOM queries** by caching references

#### Memory Management

- Store character references in array
- Clean up on character removal
- Avoid memory leaks in event listeners
- Efficient timer management

## Implementation Order

1. ✅ Create architecture and technical specs
2. HTML structure with world layers
3. CSS styling for world background
4. Font integration and typography
5. Character CSS with proper dimensions
6. Animation keyframes for walking
7. JavaScript Character class
8. JavaScript CharacterManager class
9. Form handling and spawn logic
10. Movement and physics logic
11. Jump animation system
12. Name label positioning
13. Game loop implementation
14. Boundary checking and collision
15. Testing and refinement

## Success Criteria

- ✅ Single HTML file with embedded CSS/JS
- ✅ Full viewport responsive world
- ✅ Detailed Minecraft-style landscape
- ✅ Authentic blocky character proportions
- ✅ Smooth walking animations
- ✅ Random jumping at intervals
- ✅ Boundary-constrained movement
- ✅ Customizable character colors
- ✅ Floating name labels
- ✅ 15-character maximum
- ✅ Minecraft fonts throughout
- ✅ No external dependencies
- ✅ 60fps performance
