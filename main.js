const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const CELL = 3;
const WIDTH = Math.floor(window.innerWidth / CELL);

const HEIGHT = Math.floor(window.innerHeight / CELL);

canvas.width = WIDTH * CELL;
canvas.height = HEIGHT * CELL;

const pixels = new Uint8Array(WIDTH * HEIGHT);

let rules = [];
let colors = [];
let stepsPerFrame = 500;
let useHSL = false;
let paused = false;

const ant = {
  x: Math.floor(WIDTH / 2),
  y: Math.floor(HEIGHT / 2),
  dir: 0
};

// 0->up 1->right 2->down 3->left
const step = function(ant) {
  const i = ant.y * WIDTH + ant.x;
  const turn = rules[pixels[i]] === 'R' ? 1 : 3;

  ant.dir = (ant.dir + turn) % 4;


  pixels[i] = (pixels[i] + 1) % rules.length;
  draw(ant.x, ant.y, pixels[i]);

  if (ant.dir === 0) ant.y--;
  else if (ant.dir === 1) ant.x++;
  else if (ant.dir === 2) ant.y++;
  else if (ant.dir === 3) ant.x--;
}

const draw = function(x, y, val) {
  ctx.fillStyle = colors[val];
  ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
}

const loop = function() {
  if (!paused) {
    stepsPerFrame = parseInt(document.getElementById('stepsPerFrame').value);
    for (let i = 0; i < stepsPerFrame; i++) {
      step(ant);
    }
  }
  requestAnimationFrame(loop);
}

const reset = function() {
  rules = document.getElementById('rules').value.toUpperCase().split('');
  colors = rules.map((_, i) => {
    if (useHSL) return `hsl(${(i / rules.length) * 360}, 80%, 50%)`;
    const l = Math.round((i / (rules.length - 1)) * 255);
    return `rgb(${l},${l},${l})`;
  });
  pixels.fill(0);
  ant.x = Math.floor(WIDTH / 2);
  ant.y = Math.floor(HEIGHT / 2);
  ant.dir = 0;
  ctx.clearRect(0, 0, WIDTH * CELL, HEIGHT * CELL);
}

const pauseBtn = document.getElementById('pauseBtn');
pauseBtn.addEventListener('click', () => {
  paused = !paused;
  pauseBtn.textContent = paused ? 'play' : 'pause';
});

const colorBtn = document.getElementById('colorBtn');
colorBtn.addEventListener('click', () => {
  useHSL = !useHSL;
  colorBtn.textContent = useHSL ? 'hsl' : 'greyscale';
  reset();
});

document.getElementById('resetBtn').addEventListener('click', reset);

reset();
loop();




