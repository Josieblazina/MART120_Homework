var headX = 200;
var headY = 150;
var headDirection = 2;

var bodyY = 230;
var bodyDirection = 2;

var size = 22;
var count = 0;
var sizeDirection = 2;

var nameX = 270;
var nameY = 500;
var nameDir = "right";

var eyeX = 175;
var eyeXSpeed = 1.5;
var eyeColor;

var smileY = 240;
var smileYSpeed = 1;
var smileColor;

var freckleY = 215;
var freckleYSpeed = 0.8;
var freckleColor;

var hairX = 200;
var hairY = 200;
var hairXSpeed = 1;
var hairYSpeed = 1;
var hairColor;

var titleSize = 20;
var titleGrowing = true;

var faceSize = 140;
var faceGrowing = true;

function setup() {
  createCanvas(400, 400);
  eyeColor = color(0);
  smileColor = color(150, 50, 75);
  freckleColor = color(120, 70, 50);
  hairColor = color(120, 72, 30);
}

function draw() {
  background(245, 240, 235);

  // Title animation
  fill(60);
  textSize(titleSize);
  text("Code Portrait", 90, 30);

  if (titleGrowing) {
    titleSize += 0.4;
    if (titleSize > 30) {
      titleGrowing = false;
    }
  } else {
    titleSize -= 0.4;
    if (titleSize < 20) {
      titleGrowing = true;
    }
  }

  // Animate eyes
  eyeX += eyeXSpeed;
  if (eyeX > width - 25 || eyeX < 25) {
    eyeXSpeed *= -1;
    eyeColor = color(random(255), random(255), random(255));
  }

  smileY += smileYSpeed;
  if (smileY > 250 || smileY < 230) {
    smileYSpeed *= -1;
    smileColor = color(random(255), random(255), random(255));
  }

  freckleY += freckleYSpeed;
  if (freckleY > 225 || freckleY < 205) {
    freckleYSpeed *= -1;
    freckleColor = color(random(255), random(255), random(255));
  }

  hairX += hairXSpeed;
  hairY += hairYSpeed;
  if (hairX > 210 || hairX < 190) {
    hairXSpeed *= -1;
    hairColor = color(random(255), random(255), random(255));
  }
  if (hairY > 210 || hairY < 190) {
    hairYSpeed *= -1;
    hairColor = color(random(255), random(255), random(255));
  }

  // Face 
  if (faceGrowing) {
    faceSize += 0.3;
    if (faceSize > 150) faceGrowing = false;
  } else {
    faceSize -= 0.3;
    if (faceSize < 130) faceGrowing = true;
  }

  // Hair
  fill(hairColor);
  noStroke();
  ellipse(hairX, hairY, 170, 180);

  // Face
  fill(255, 224, 189);
  ellipse(200, 200, faceSize, 160);

  // Eyes
  fill(eyeColor);
  ellipse(eyeX, 190, 25, 15);
  ellipse(width - eyeX, 190, 25, 15);

  // Nose
  noStroke();
  fill(255, 205, 170);
  triangle(195, 200, 205, 200, 200, 220);

  // Smile (up and down)
  noFill();
  stroke(smileColor);
  strokeWeight(2);
  arc(200, smileY, 40, 20, 0, PI);

  // Neck
  noStroke();
  fill(255, 224, 189);
  rect(185, 275, 30, 30);

  // Shirt
  fill(190, 160, 255);
  rect(150, 305, 100, 60);

  // Mole 
  stroke(freckleColor);
  strokeWeight(4);
  point(190, freckleY);

  // Signature moving in square pattern
  noStroke();
  fill(60);
  textSize(12);
  text("By Josie Blazina", nameX, nameY);

  if (nameDir === "right") {
    nameX += 1;
    if (nameX >= 310) nameDir = "up";
  } else if (nameDir === "up") {
    nameY -= 1;
    if (nameY <= 370) nameDir = "left";
  } else if (nameDir === "left") {
    nameX -= 1;
    if (nameX <= 270) nameDir = "down";
  } else if (nameDir === "down") {
    nameY += 1;
    if (nameY >= 390) nameDir = "right";
  }
}