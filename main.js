const canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 84;

const c = canvas.getContext("2d");

const demoButtonsEl = document.querySelector(".demo-buttons");
const demoButtons = demoButtonsEl.querySelectorAll("button");
const demoForms = document.querySelectorAll(".demo-form");

let stopVideo = false; // global scope to stop the video
let stopParticles = false;
let stopGame = false;

function clearCanvas() {
  c.clearRect(0, 0, canvas.width, canvas.height);
}

function selectDemo(i) {
  clearCanvas();

  stopVideo = true;
  stopParticles = true;
  stopGame = true;
  demoForms.forEach((form) => {
    form.classList.add("hidden");
  });

  demoForms[i].classList.remove("hidden");
}

{
  // Demo 1
  demoButtons[0].addEventListener("click", () => {
    selectDemo(0);
    setDemo1();
  });

  const demo1Form = demoForms[0];
  const ui = {};

  function setDemo1() {
    ui.select = demo1Form.querySelector("select");
    [ui.coordX, ui.coordY, ui.size] = [
      ...demo1Form.querySelectorAll("input[type=number"),
    ];
    ui.color = demo1Form.querySelector("[type=color");
    ui.btn = demo1Form.querySelector("button");

    ui.btn.addEventListener("click", drawShape);
  }

  function drawShape() {
    c.fillStyle = ui.color.value;
    switch (ui.select.value) {
      case "square":
        c.fillRect(
          ui.coordX.value,
          ui.coordY.value,
          ui.size.value,
          ui.size.value
        );
        break;
      case "circle":
        c.beginPath();
        c.arc(ui.coordX.value, ui.coordY.value, ui.size.value, 0, 2 * Math.PI);
        c.fill();
        break;
    }
  }
}

{
  // Demo 2
  demoButtons[1].addEventListener("click", () => {
    selectDemo(1);
    setDemo2();
  });

  const demo2Form = demoForms[1];
  const ui = {};
  const controller = {
    isLineStart: true,
  };

  function setDemo2() {
    ui.color = demo2Form.querySelector("[type=color]");
    ui.width = demo2Form.querySelector("[type=number]");
    [ui.newLine, ui.fill] = demo2Form.querySelectorAll("button");
    c.strokeStyle = c.fillStyle = ui.color.value;
    c.lineWidth = ui.width.value;

    let mouseListener = canvas.addEventListener("mousemove", mouseMoveHandler);

    ui.fill.addEventListener("click", () => {
      c.fill();
    });

    ui.newLine.addEventListener("click", () => {
      controller.isLineStart = true;
      c.closePath();
      c.stroke();
    });

    ui.color.addEventListener("input", () => {
      c.strokeStyle = c.fillStyle = ui.color.value;
    });

    ui.width.addEventListener("input", () => {
      c.lineWidth = ui.width.value;
    });
  }

  function mouseMoveHandler(e) {
    const coords = [e.clientX, e.clientY];
    if (e.buttons === 1) {
      if (controller.isLineStart) {
        startLine(coords);
      } else {
        drawLine(coords);
      }
    }
  }

  function drawLine(coords) {
    c.lineTo(...coords);
    c.stroke();
  }

  function startLine(coords) {
    c.beginPath();
    c.moveTo(...coords);
    controller.isLineStart = false;
  }
}

{
  // Demo 3

  const video = document.createElement("video");

  let x,
    y,
    width,
    height,
    xMax = window.innerWidth;

  video.addEventListener("", () => {
    console.log(video);
  });

  demoButtons[2].addEventListener("click", () => {
    selectDemo(2);
    setDemo3();
  });

  function setDemo3() {
    video.src = "example.mp4";
    stopVideo = false;

    video.play();

    (x = -200), (y = 0), (width = 200), (height = 112.5);
  }

  function loop(target) {
    c.drawImage(target, x, y, width, height);

    if (x + width + width < xMax) {
      x += width;
    } else {
      (y += height), (x = 0);
    }

    setTimeout(() => {
      if (!stopVideo) loop(target);
    }, 1000);
  }

  video.addEventListener("play", function (ev) {
    loop(ev.target);
  });
}

{
  // Demo 4

  const cursor = {
    x: innerWidth / 2,
    y: innerHeight / 2,
  };

  let particlesArray = [];

  demoButtons[3].addEventListener("click", () => {
    selectDemo(3);
    particlesArray = [];
    stopParticles = false;
    setTimeout(() => {
      generateParticles(101);
      anim();
    }, 700);
  });

  addEventListener("mousemove", (e) => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
  });

  addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault();
      cursor.x = e.touches[0].clientX;
      cursor.y = e.touches[0].clientY;
    },
    { passive: false }
  );

  function generateParticles(amount) {
    for (let i = 0; i < amount; i++) {
      particlesArray.push(
        new Particle(innerWidth / 2, innerHeight / 2, 4, generateColor(), 0.02)
      );
    }
  }

  function generateColor() {
    let hexSet = "0123456789ABCDEF";
    let finalHexString = "#";
    for (let i = 0; i < 6; i++) {
      finalHexString += hexSet[Math.ceil(Math.random() * 15)];
    }
    return finalHexString;
  }

  function Particle(x, y, particleTrailWidth, strokeColor, rotateSpeed) {
    this.x = x;
    this.y = y;
    this.particleTrailWidth = particleTrailWidth;
    this.strokeColor = strokeColor;
    this.theta = Math.random() * Math.PI * 2;
    this.rotateSpeed = Math.random() * 0.02 + 0.002;
    this.t = Math.random() * 150;

    this.rotate = () => {
      const ls = {
        x: this.x,
        y: this.y,
      };
      this.theta += this.rotateSpeed;
      this.x = cursor.x + Math.cos(this.theta) * this.t;
      this.y = cursor.y + Math.sin(this.theta) * this.t;
      c.beginPath();
      c.lineWidth = this.particleTrailWidth;
      c.strokeStyle = this.strokeColor;
      c.moveTo(ls.x, ls.y);
      c.lineTo(this.x, this.y);
      c.stroke();
    };
  }

  function anim() {
    if (!stopParticles) {
      requestAnimationFrame(anim);
    }

    c.fillStyle = "rgba(0,0,0,0.05)";
    c.fillRect(0, 0, canvas.width, canvas.height);

    particlesArray.forEach((particle) => particle.rotate());
  }
}

{
  // Demo 5

  const score = document.querySelector("span.score");

  let foodArray = [];
  const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 30,
    step: 12,
    score: 0,
  };

  demoButtons[4].addEventListener("click", () => {
    selectDemo(4);
    setDemo5();
  });

  function setDemo5() {
    stopGame = false;
    generateFood(15);
    initalizePlayerControls();
    updateMap();
    // startGame();
  }

  function drawBorders() {
    c.strokeStyle = "#000000";
    c.lineWidth = 20;
    c.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
  }

  function generateFood(num) {
    for (let i = 0; i < num; i++) {
      foodArray.push(new Food());
    }
    console.log(foodArray);
  }

  function Food() {
    this.x = 50 + Math.random() * (canvas.width - 100);
    this.y = 50 + Math.random() * (canvas.height - 100);
    this.size = 20;
  }

  Food.prototype.draw = function () {
    c.fillStyle = "#fc910f";
    c.beginPath();
    c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    c.fill();
  };

  function drawPlayer() {
    c.fillStyle = "#45cc37";
    c.beginPath();
    c.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    c.fill();
  }

  function initalizePlayerControls() {
    document.addEventListener("keydown", (e) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
        return;
      movePlayer(e.key.slice(5).toLowerCase());
    });
  }

  function movePlayer(direction) {
    switch (direction) {
      case "up":
        player.y -= player.step;
        break;
      case "down":
        player.y += player.step;
        break;
      case "left":
        player.x -= player.step;
        break;
      case "right":
        player.x += player.step;
        break;
    }
    checkFood();
    updateMap();
  }

  function updateMap() {
    clearCanvas();
    drawBorders();
    for (let food of foodArray) {
      console.log(food);
      food.draw();
    }
    drawPlayer();

    //score
    score.textContent = player.score;
  }

  function checkFood() {
    let eatenFoodIndices = [];

    foodArray.forEach((food, index) => {
      if (doCirclesCollide(player, food)) eatenFoodIndices.push(index);
    });

    eatenFoodIndices.reverse().forEach((index) => {
      foodArray.splice(index, 1);
      player.score += 100;
    });
  }

  function doCirclesCollide(circle1, circle2) {
    let xDistance = circle1.x - circle2.x;
    let yDistance = circle1.y - circle2.y;
    let distance = (xDistance ** 2 + yDistance ** 2) ** 0.5;
    let collisionDistance = circle1.size + circle2.size;
    console.log(distance, collisionDistance);

    return distance < collisionDistance; // circles are colliding
  }
}
