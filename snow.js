const container = document.getElementById('snow-container');
const snowCanvas = document.getElementById('snow-build-up');
const ctx = snowCanvas.getContext('2d');
const snowflakes = [];

snowCanvas.width = container.offsetWidth;
snowCanvas.height = container.offsetHeight;

const snowflakeCharacters = ['❄', '*', '❉', '❃', '❅'];
let lastFrameTime = performance.now();
let snowflakeCounter = 0;
const snowflakeCreationRate = 3; // Har 3 kadrda yangi qor parchasi yaratiladi

function createSnowflake() {
  const snowflake = {
    x: Math.random() * snowCanvas.width,
    y: -10,
    size: Math.random() * 20 + 10,
    speed: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.5,
    character: snowflakeCharacters[Math.floor(Math.random() * snowflakeCharacters.length)]
  };
  snowflakes.push(snowflake);
}

function drawSnowflakes(deltaTime) {
  ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.689)';
  snowflakes.forEach((snowflake, index) => {
    ctx.globalAlpha = snowflake.opacity;
    ctx.font = `${snowflake.size}px sans-serif`;
    ctx.fillText(snowflake.character, snowflake.x, snowflake.y);
    ctx.globalAlpha = 1;

    snowflake.y += snowflake.speed * deltaTime * 60;

    // Agar qor ekrandan chiqsa, uni olib tashlash
    if (snowflake.y > snowCanvas.height) {
      snowflakes.splice(index, 1);
    }
  });
}

function animate() {
  const currentTime = performance.now();
  const deltaTime = (currentTime - lastFrameTime) / 1000;
  lastFrameTime = currentTime;

  if (snowflakeCounter % snowflakeCreationRate === 0) {
    createSnowflake();
  }
  snowflakeCounter++;

  drawSnowflakes(deltaTime);
  requestAnimationFrame(animate);
}

animate();
