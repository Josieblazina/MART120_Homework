// Interactive Van Gogh - Final 
// Generative art final inspired by Vincent van Gogh's post-impressionist style
// Features flow fields, interactive elements, and Van Gogh-inspired brushstrokes

// Main variables
let particles = [];
let maxParticles = 2000;
let flowField;
let flowFieldResolution = 15; 
let zoff = 0;
let colorPalettes = {};
let activePalette;
let backgroundColor;
let canvas;

// Painting style variables
let noiseScale = 0.005; // Scale of the noise (smaller = smoother)
let noiseStrength = 2; // How much the noise affects particle movement
let particleMaxSpeed = 4; // Maximum speed of particles
let particleMinSpeed = 0.5; // Minimum speed of particles
let strokeWidthMin = 1; // Minimum stroke width
let strokeWidthMax = 5; // Maximum stroke width
let strokeLength = 10; // Length of the brush strokes
let curlStrength = 0.4; // Strength of the curl noise effect


let showControls = true;
let sliders = {};
let buttons = {};
let paletteSelect;
let controlPanel;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 100);
  
  // Color palettes based on Van Gogh works
  setupColorPalettes();
  activePalette = "starryNight";
  backgroundColor = color(colorPalettes[activePalette].background);
  
  // Initialize flow field
  cols = floor(width / flowFieldResolution);
  rows = floor(height / flowFieldResolution);
  flowField = new Array(cols * rows);
  
  // Initialize particles
  createParticles(maxParticles);
  

  setupControls();
  
  // Initial background
  background(backgroundColor);
}

function draw() {
  
  if (frameCount % 5 === 0) {
    push();
    noStroke();
    fill(hue(backgroundColor), saturation(backgroundColor), brightness(backgroundColor), 3);
    rect(0, 0, width, height);
    pop();
  }
  
 
  updateFlowField();
  

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].follow(flowField);
    particles[i].update();
    particles[i].display();
    particles[i].edges();
    
    // Remove dead particles
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
  
  // New particles to maintain count
  if (particles.length < maxParticles && frameCount % 10 === 0) {
    particles.push(new Particle(random(width), random(height)));
  }
  
  
  if (showControls) {
    displayControls();
  }
  
  // Advance noise dimension 
  zoff += 0.002;
}


function setupColorPalettes() {
  // using exact hex codes from the provided palette
  // starry night
  colorPalettes.starryNight = {
    colors: [
      color('#173679'),   // deep blue
      color('#4888C8'),   // medium blue
      color('#7FC5DC'),   // light blue
      color('#E8E163'),   // yellow
      color('#DB901C')    // orange
    ],
    background: '#0B1E38'  // very dark blue-black
  };
  
  // Sunflowers palette
  colorPalettes.sunflowers = {
    colors: [
      color('#FFDA22'),  // bright yellow
      color('#E8A317'),  // orange
      color('#4E7B38'),  // green
      color('#FFF380'),  // light yellow
      color('#8B5A2B')   // brown
    ],
    background: '#FDF5E6'  // off-white
  };
  
  // Almond Blossoms palette
  colorPalettes.almondBlossoms = {
    colors: [
      color('#67BDDE'),  // sky blue
      color('#F5CCD4'),  // pink
      color('#FFFFFF'),  // white
      color('#5D8B4F'),  // green
      color('#2A5B8C')   // blue
    ],
    background: '#AED6F1'  // light blue
  };
  
  // Wheatfield with Crows palette
  colorPalettes.wheatfield = {
    colors: [
      color('#E6C35C'),  // yellow
      color('#2F4F81'),  // dark blue
      color('#8B2323'),  // dark red
      color('#8B5A2B'),  // brown
      color('#556B2F')   // dark green
    ],
    background: '#D2B48C'  // tan
  };
  
  // Café Terrace at Night palette
  colorPalettes.cafeTerrace = {
    colors: [
      color('#F4D03F'),  // yellow
      color('#2E86C1'),  // blue
      color('#AF601A'),  // orange-brown
      color('#7D3C98'),  // purple
      color('#148F77')   // teal
    ],
    background: '#1F2B38'  // dark blue-gray
  };
}


function createParticles(count) {
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}


function setupControls() {
  // Create a container div for the control panel
  controlPanel = createDiv('');
  controlPanel.id('control-panel');
  controlPanel.position(20, 20);
  
  // Add custom styling to panel
  let panelStyle = `
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 15px;
    padding: 15px;
    width: 250px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
    font-family: 'Arial', sans-serif;
    color: white;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  `;
  controlPanel.style(panelStyle);

  // Add title to the panel
  let titleDiv = createDiv('<h2>Van Gogh Settings</h2>');
  titleDiv.style('color', '#F4D03F');
  titleDiv.style('text-align', 'center');
  titleDiv.style('margin-top', '0');
  titleDiv.style('font-size', '18px');
  titleDiv.style('border-bottom', '1px solid rgba(255, 255, 255, 0.3)');
  titleDiv.style('padding-bottom', '10px');
  titleDiv.style('margin-bottom', '15px');
  titleDiv.parent(controlPanel);

  // sliders
  createStyledSlider('noiseScale', 'Flow Detail', 0.001, 0.02, noiseScale, 0.001);
  createStyledSlider('noiseStrength', 'Flow Strength', 0.1, 5, noiseStrength, 0.1);
  createStyledSlider('particleSpeed', 'Brush Speed', 0.5, 10, particleMaxSpeed, 0.5);
  createStyledSlider('strokeWidth', 'Brush Size', 1, 10, strokeWidthMax, 0.5);
  createStyledSlider('curlStrength', 'Swirl Effect', 0, 1, curlStrength, 0.05);
  createStyledSlider('particleCount', 'Brush Density', 100, 5000, maxParticles, 100);
  
  // palette selector
  let paletteDiv = createDiv('<p>Painting Style:</p>');
  paletteDiv.style('margin', '10px 0 5px 0');
  paletteDiv.parent(controlPanel);
  
  paletteSelect = createSelect();
  paletteSelect.style('width', '100%');
  paletteSelect.style('padding', '5px');
  paletteSelect.style('border-radius', '5px');
  paletteSelect.style('background-color', 'rgba(255, 255, 255, 0.1)');
  paletteSelect.style('color', 'white');
  paletteSelect.style('border', '1px solid rgba(255, 255, 255, 0.3)');
  paletteSelect.style('margin-bottom', '15px');
  paletteSelect.style('cursor', 'pointer');
  paletteSelect.parent(controlPanel);
  
  paletteSelect.option('Starry Night', 'starryNight');
  paletteSelect.option('Sunflowers', 'sunflowers');
  paletteSelect.option('Almond Blossoms', 'almondBlossoms');
  paletteSelect.option('Wheatfield with Crows', 'wheatfield');
  paletteSelect.option('Cafe Terrace', 'cafeTerrace');
  paletteSelect.selected('starryNight');
  paletteSelect.changed(changePalette);
  
  // Button 
  let buttonContainer = createDiv('');
  buttonContainer.style('display', 'flex');
  buttonContainer.style('justify-content', 'space-between');
  buttonContainer.style('margin-top', '10px');
  buttonContainer.parent(controlPanel);
  
  // styled buttons
  buttons.clear = createStyledButton('Clear', clearCanvas, buttonContainer);
  buttons.save = createStyledButton('Save', saveArtwork, buttonContainer);
  
  // Toggle controls button (separate from the container)
  buttons.hideControls = createStyledButton('Hide Panel', toggleControls, controlPanel);
  buttons.hideControls.style('width', '100%');
  buttons.hideControls.style('margin-top', '15px');
  
  // info section
  let infoDiv = createDiv('<p style="font-size: 12px; opacity: 0.7; margin-top: 15px;">Press SPACE to toggle panel<br>Press S to save<br>Press C to clear<br>Keys 1-5 change styles</p>');
  infoDiv.style('text-align', 'center');
  infoDiv.style('border-top', '1px solid rgba(255, 255, 255, 0.3)');
  infoDiv.style('padding-top', '10px');
  infoDiv.parent(controlPanel);
  
  // FPS counter
  let fpsDiv = createDiv('FPS: --');
  fpsDiv.id('fps-counter');
  fpsDiv.style('position', 'absolute');
  fpsDiv.style('bottom', '10px');
  fpsDiv.style('right', '10px');
  fpsDiv.style('background-color', 'rgba(0, 0, 0, 0.5)');
  fpsDiv.style('color', 'white');
  fpsDiv.style('padding', '5px 10px');
  fpsDiv.style('border-radius', '5px');
  fpsDiv.style('font-size', '12px');
}

// function to create styled sliders
function createStyledSlider(id, label, min, max, value, step) {
  let containerDiv = createDiv('');
  containerDiv.style('margin-bottom', '10px');
  containerDiv.parent(controlPanel);
  
  let labelP = createDiv('<p>' + label + ': <span id="' + id + '-value">' + value + '</span></p>');
  labelP.style('margin', '5px 0');
  labelP.style('font-size', '14px');
  labelP.parent(containerDiv);
  
  sliders[id] = createSlider(min, max, value, step);
  sliders[id].style('width', '100%');
  sliders[id].style('-webkit-appearance', 'none');
  sliders[id].style('height', '6px');
  sliders[id].style('border-radius', '3px');
  sliders[id].style('background', 'rgba(255, 255, 255, 0.2)');
  sliders[id].style('outline', 'none');
  sliders[id].parent(containerDiv);
  
  // Add event listener 
  sliders[id].input(() => {
    select('#' + id + '-value').html(sliders[id].value());
  });
}

// function to create styled buttons
function createStyledButton(label, callback, parent) {
  let btn = createButton(label);
  btn.style('padding', '8px 15px');
  btn.style('background-color', 'rgba(244, 208, 63, 0.7)');
  btn.style('color', 'black');
  btn.style('border', 'none');
  btn.style('border-radius', '5px');
  btn.style('font-weight', 'bold');
  btn.style('cursor', 'pointer');
  btn.style('transition', 'background-color 0.3s');
  btn.mouseOver(() => btn.style('background-color', 'rgba(244, 208, 63, 1)'));
  btn.mouseOut(() => btn.style('background-color', 'rgba(244, 208, 63, 0.7)'));
  btn.mousePressed(callback);
  btn.parent(parent);
  return btn;
}

// Function to toggle visibility of controls
function toggleControls() {
  showControls = !showControls;
  
  if (showControls) {
    controlPanel.style('display', 'block');
    buttons.hideControls.html('Hide Panel');
  } else {
    controlPanel.style('display', 'none');
    select('#fps-counter').style('display', 'none');
    
    // Create a minimal show button
    let showBtn = createButton('Show Panel');
    showBtn.position(20, 20);
    showBtn.style('padding', '8px 15px');
    showBtn.style('background-color', 'rgba(0, 0, 0, 0.7)');
    showBtn.style('color', 'white');
    showBtn.style('border', 'none');
    showBtn.style('border-radius', '5px');
    showBtn.style('cursor', 'pointer');
    showBtn.mousePressed(() => {
      showControls = true;
      controlPanel.style('display', 'block');
      select('#fps-counter').style('display', 'block');
      showBtn.remove();
    });
  }
}


function displayControls() {
  // Update FPS counter
  select('#fps-counter').html('FPS: ' + floor(frameRate()));
  
  // Update variables from sliders
  noiseScale = sliders.noiseScale.value();
  noiseStrength = sliders.noiseStrength.value();
  particleMaxSpeed = sliders.particleSpeed.value();
  strokeWidthMax = sliders.strokeWidth.value();
  curlStrength = sliders.curlStrength.value();
  maxParticles = sliders.particleCount.value();
}

// Function to clear canvas
function clearCanvas() {
  background(backgroundColor);
  particles = [];
  createParticles(maxParticles);
}

// Function to change active color palette
function changePalette() {
  activePalette = paletteSelect.value();
  backgroundColor = color(colorPalettes[activePalette].background);
  
  // Update some existing particles with new colors
  for (let i = 0; i < particles.length; i++) {
    if (random() < 0.2) { // Only change 20% of particles at once for smoother transition
      particles[i].color = random(colorPalettes[activePalette].colors);
    }
  }
}

// Function to save artwork
function saveArtwork() {
  saveCanvas('VanGogh_Interactive_' + year() + month() + day() + hour() + minute() + second(), 'png');
}

// update flow field
function updateFlowField() {
  let yoff = 0;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      
      
      let angle;
      
      
      if (curlStrength > 0) {
        let curl = computeCurl(xoff, yoff, zoff);
        angle = curl * TWO_PI * curlStrength + noise(xoff, yoff, zoff) * TWO_PI * (1 - curlStrength);
      } else {
        angle = noise(xoff, yoff, zoff) * TWO_PI * 2;
      }
      
      
      let v = p5.Vector.fromAngle(angle);
      v.setMag(noiseStrength);
      flowField[index] = v;
      
      xoff += noiseScale;
    }
    yoff += noiseScale;
  }
}

// Function to compute curl of noise field 
function computeCurl(x, y, z) {
  let eps = 0.0001;
  
  // Find rate of change in x and y directions
  let n1 = noise(x + eps, y, z);
  let n2 = noise(x - eps, y, z);
  let dx = (n1 - n2) / (2 * eps);
  
  let n3 = noise(x, y + eps, z);
  let n4 = noise(x, y - eps, z);
  let dy = (n3 - n4) / (2 * eps);
  
  // Curl is perpendicular to gradient
  return atan2(dy, -dx) / TWO_PI;
}

// Mouse interactions
function mouseMoved() {
  // Add disturbance to the flow field where the mouse is
  if (showControls && mouseX < 290 && mouseY < 450) return; // Don't interact with UI area
  
  let mouseCol = floor(mouseX / flowFieldResolution);
  let mouseRow = floor(mouseY / flowFieldResolution);
  
  if (mouseCol >= 0 && mouseCol < cols && mouseRow >= 0 && mouseRow < rows) {
    // Calculate angle from mouse movement
    let angle;
    if (pmouseX !== mouseX || pmouseY !== mouseY) {
      angle = atan2(mouseY - pmouseY, mouseX - pmouseX);
    } else {
      angle = random(TWO_PI);
    }
    
    // Create disturbance in flow field
    let v = p5.Vector.fromAngle(angle);
    v.setMag(5);
    
    // Affect area around mouse
    for (let y = -2; y <= 2; y++) {
      for (let x = -2; x <= 2; x++) {
        let col = mouseCol + x;
        let row = mouseRow + y;
        if (col >= 0 && col < cols && row >= 0 && row < rows) {
          let index = col + row * cols;
          // Blend with existing flow
          let blend = map(dist(mouseCol, mouseRow, col, row), 0, 3, 0.8, 0.1);
          flowField[index].lerp(v, blend);
        }
      }
    }
    
    // Add a few particles at mouse position
    if (frameCount % 2 === 0) {
      for (let i = 0; i < 3; i++) {
        if (particles.length < maxParticles * 1.2) {
          let p = new Particle(mouseX + random(-10, 10), mouseY + random(-10, 10));
          p.vel = p5.Vector.fromAngle(angle + random(-0.5, 0.5));
          p.vel.mult(random(2, 5));
          particles.push(p);
        }
      }
    }
  }
}

function mouseClicked() {
  // Ignore clicks in the UI area
  if (showControls && mouseX < 290 && mouseY < 450) return;
  
  // Add a burst of particles at mouse position
  for (let i = 0; i < 30; i++) {
    if (particles.length < maxParticles * 1.5) {
      let p = new Particle(mouseX + random(-5, 5), mouseY + random(-5, 5));
      let angle = random(TWO_PI);
      p.vel = p5.Vector.fromAngle(angle);
      p.vel.mult(random(3, 8));
      particles.push(p);
    }
  }
}

function doubleClicked() {
  // Ignore double-clicks in the UI area
  if (showControls && mouseX < 290 && mouseY < 450) return;
  
  // Create a swirl pattern around click point
  let centerX = mouseX;
  let centerY = mouseY;
  let radius = 150;
  
  for (let i = 0; i < 100; i++) {
    if (particles.length < maxParticles * 1.5) {
      let angle = random(TWO_PI);
      let r = random(20, radius);
      let x = centerX + cos(angle) * r;
      let y = centerY + sin(angle) * r;
      
      let p = new Particle(x, y);
      
      // Make particles move in a spiral pattern
      let spiralAngle = atan2(y - centerY, x - centerX) + PI/2;
      p.vel = p5.Vector.fromAngle(spiralAngle);
      p.vel.mult(map(r, 0, radius, 0.5, 5));
      
      particles.push(p);
    }
  }
}

function keyPressed() {
  // Space to toggle controls
  if (key === ' ') {
    toggleControls();
  }
  
  // 'S' to save
  if (key === 's' || key === 'S') {
    saveArtwork();
  }
  
  // 'C' to clear
  if (key === 'c' || key === 'C') {
    clearCanvas();
  }
  
  // '1-5' to switch palettes
  if (key === '1') {
    paletteSelect.selected('starryNight');
    changePalette();
  } else if (key === '2') {
    paletteSelect.selected('sunflowers');
    changePalette();
  } else if (key === '3') {
    paletteSelect.selected('almondBlossoms');
    changePalette();
  } else if (key === '4') {
    paletteSelect.selected('wheatfield');
    changePalette();
  } else if (key === '5') {
    paletteSelect.selected('cafeTerrace');
    changePalette();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // Recalculate flow field dimensions
  cols = floor(width / flowFieldResolution);
  rows = floor(height / flowFieldResolution);
  flowField = new Array(cols * rows);
  
  // Repaint background
  background(backgroundColor);
}

// Particle class
class Particle {
  constructor(x, y) {
    this.pos = createVector(x || random(width), y || random(height));
    this.prevPos = this.pos.copy();
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = random(particleMinSpeed, particleMaxSpeed);
    this.color = random(colorPalettes[activePalette].colors);
    this.strokeWidth = random(strokeWidthMin, strokeWidthMax);
    this.lifespan = random(100, 200);
    this.alpha = random(40, 80);
    this.swirlyness = random(0.2, 1); // How much the brushstroke swirls
    
    // Store the original HSB values for color modulation
    this.colorH = hue(this.color);
    this.colorS = saturation(this.color);
    this.colorB = brightness(this.color);
  }
  
  update() {
    // Update velocity based on acceleration
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    
    // Store previous position for stroke
    this.prevPos = this.pos.copy();
    
    // Update position based on velocity
    this.pos.add(this.vel);
    
    // Reset acceleration
    this.acc.mult(0);
    
    // Decrease lifespan
    this.lifespan -= random(0.8, 1.2);
  }
  
  applyForce(force) {
    this.acc.add(force);
  }
  
  // Check for particle death
  isDead() {
    return this.lifespan <= 0;
  }
  
  // Follow flow field
  follow(flowfield) {
    // Get position in flow field
    let x = floor(this.pos.x / flowFieldResolution);
    let y = floor(this.pos.y / flowFieldResolution);
    let index = x + y * cols;
    
   
    if (x >= 0 && x < cols && y >= 0 && y < rows) {
      let force = flowfield[index].copy();
      this.applyForce(force);
    }
  }
  
  // Van Gogh brushstroke display
  display() {
    if (this.lifespan <= 0) return;
    
    
    let alpha = map(this.lifespan, 0, 200, 0, this.alpha);
    
    
    let hueVariation = this.colorH + sin(frameCount * 0.01 + this.pos.x * 0.01) * 5;
    let satVariation = this.colorS + cos(frameCount * 0.02 + this.pos.y * 0.01) * 5;
    let briVariation = this.colorB + sin(frameCount * 0.03 + this.pos.x * 0.01 + this.pos.y * 0.01) * 5;
    
    // Create modulated color
    let displayColor = color(
      constrain(hueVariation, 0, 100),
      constrain(satVariation, 0, 100),
      constrain(briVariation, 0, 100),
      alpha
    );
    
    // Set stroke properties
    stroke(displayColor);
    strokeWeight(this.strokeWidth * (this.lifespan / 200));
    
    // movement direction and length
    let angle = this.vel.heading();
    let len = this.vel.mag() * strokeLength;
    
    // Draw Van Gogh style brush stroke
    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle);
    
    // Create curved brushstroke
    beginShape();
    noFill();
    for (let i = -len/2; i < len/2; i += 1) {
      let xOffset = i;
      
      // Create swirly, impasto-like 
      let yOffset = sin(i * 0.3 * this.swirlyness) * this.strokeWidth * 0.5;
      
      // small variations for texture
      yOffset += sin(i * 0.8) * this.strokeWidth * 0.2;
      
      // Vary stroke width along the line
      let sw = this.strokeWidth * (1 + sin(i * 0.2) * 0.3);
      strokeWeight(sw * (this.lifespan / 200));
      

      vertex(xOffset, yOffset);
    }
    endShape();
    
    pop();
  }
  
  // Handle edges of canvas
  edges() {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.prevPos.x = 0;
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.prevPos.x = width;
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.prevPos.y = 0;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.prevPos.y = height;
    }
  }
}

// P5.js function for handling touch events
function touchMoved() {
  // Mirror mouse behavior for touch devices
  mouseMoved();
  return false; // Prevent default
}

function touchStarted() {
  // Ignore touches in the UI area
  if (showControls && mouseX < 290 && mouseY < 450) return;
  
  // Add a burst of particles at touch position
  for (let i = 0; i < 20; i++) {
    if (particles.length < maxParticles * 1.5) {
      let p = new Particle(mouseX + random(-5, 5), mouseY + random(-5, 5));
      let angle = random(TWO_PI);
      p.vel = p5.Vector.fromAngle(angle);
      p.vel.mult(random(3, 8));
      particles.push(p);
    }
  }
  return false; // Prevent default
}