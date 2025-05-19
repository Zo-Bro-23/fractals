let ITERATIONS = 0;
let z = 1;
const maps = [
  {
    x: 0,
    y: 0,
  },
  {
    x: 1 / 2,
    y: 0,
  },
  {
    x: 0,
    y: 1 / 2,
  },
];

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width = document.body.clientWidth * 2;
ctx.canvas.height = window.innerHeight * 2;

console.log((ctx.canvas.width * ctx.canvas.height) / 1000000);

const WIDTH = ctx.canvas.width;
const HEIGHT = ctx.canvas.height;

const colors = ["#000", "#4287f5"];

const bounds = {
  x: [-1.5, 2.5],
  y: [-0.5, 1.5],
};

const BOUNDS = {
  x: [-1.5, 2.5],
  y: [-0.5, 1.5],
};

let n = 0;

const fractal = (points) => {
  let pz = [];
  points.forEach((z) => {
    const randomMap = maps[Math.floor(Math.random() * maps.length)];
    pz.push({ x: (1 / 2) * z.x + randomMap.x, y: (1 / 2) * z.y + randomMap.y });
  });
  if (n < ITERATIONS) {
    n++;
    fractal(pz);
  } else {
    return pz;
  }
};

const pt = (px, wh) => {
  return {
    x: bounds.x[0] + ((bounds.x[1] - bounds.x[0]) * px.x) / wh[0],
    y: bounds.y[0] + ((bounds.y[1] - bounds.y[0]) * px.y) / wh[1],
  };
};

const rpt = (px, wh) => {
  return {
    x: ((px.x - bounds.x[0]) * wh[0]) / (bounds.x[1] - bounds.x[0]),
    y: ((px.y - bounds.y[0]) * wh[1]) / (bounds.y[1] - bounds.y[0]),
  };
};

const newpt = (px) => {
  return {
    x: px.x / (WIDTH / 4) - 1.5,
    y: px.y / (HEIGHT / 2) - 0.5,
  };
};

const newrpt = (px) => {
  return {
    x: (px.x + 1.5) * (WIDTH / 4),
    y: (px.y + 0.5) * (HEIGHT / 2),
  };
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let z = [];
  for (i = 0; i < WIDTH; i++) {
    for (j = 0; j < HEIGHT; j++) {
      const p = pt({ x: i, y: j }, [WIDTH, HEIGHT]);
      if (p.x <= 1 && p.y <= 1 && p.x >= 0 && p.y >= 0) {
        z.push(p);
      }
    }
  }

  n = 0;
  m = fractal(z);
  m.forEach((p) => {
    const px = rpt(p, [WIDTH, HEIGHT]);
    ctx.fillStyle = colors[1];
    ctx.fillRect(Math.floor(px.x), Math.floor(px.y), 1, 1);
  });
  //  Math.sqrt(p.x ** 2 + p.y ** 2) < 1 ? colors[0] : colors[1];
};

draw();

canvas.addEventListener("click", (e) => {
  if (ITERATIONS <= 1000) {
    const rect = canvas.getBoundingClientRect();
    const p = pt({ x: e.clientX, y: e.clientY }, [rect.width, rect.height]);
    z = z * 10;
    zoom(z, p);
  } else {
    bounds.x = [2 - (2.5 * window.innerWidth) / window.innerHeight, 2];
    bounds.y = [-1.25, 1.25];
  }
});

const zoom = (z, p) => {
  bounds.x = [
    p.x - (BOUNDS.x[1] - BOUNDS.x[0]) / z,
    p.x + (BOUNDS.x[1] - BOUNDS.x[0]) / z,
  ];
  bounds.y = [
    p.y - (BOUNDS.y[1] - BOUNDS.y[0]) / z,
    p.y + (BOUNDS.y[1] - BOUNDS.y[0]) / z,
  ];
  draw();
};
