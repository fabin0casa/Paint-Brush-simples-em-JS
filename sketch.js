let paintWindow;
let currentTool = "pencil";
let currentColor = "black";
let icon;
let toolIcons = {};

const AVAILABLE_TOOLS = [
  "eraser",
  "paint",
  "pencil",
  "brush",
  "spray",
  "line",
  "rect",
  "circle",
];

const WEB_COLORS = [
  "black",
  "gray",
  "maroon",
  "olive",
  "green",
  "teal",
  "navy",
  "purple",
  "darkkhaki",
  "darkgreen",
  "dodgerblue",
  "royalblue",
  "blueviolet",
  "brown",
  "white",
  "silver",
  "red",
  "yellow",
  "lime",
  "aqua",
  "blue",
  "fuchsia",
  "moccasin",
  "springgreen",
  "aqua",
  "lightsteelblue",
  "deeppink",
  "orange",
];

function preload() {
  icon = loadImage("images/icon.png");
  AVAILABLE_TOOLS.forEach((tool) => {
    toolIcons[tool] = [
      loadImage(`images/${tool}.png`),
      loadImage(`images/${tool}-on.png`),
    ];
  });
}

const MARGIN = 2;
const PADDING = 5;
const ICON_SIZE = 16;
const TITLEBAR_H = 20;
const TOOLBAR_W = 76;
const PALETTE_H = 72;
const CANVAS_GAP = 28;
const TOOLBAR_BUTTON_SIZE = 32;
const PALETTE_BUTTON_SIZE = 24;

class PaintWindow {
  constructor(x, y, w, h, title) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.title = title;
    this.visible = true;

    this.initializeComponents();
  }

  initializeComponents() {
    this.closeButton = new Button(
      this.x + this.w - ICON_SIZE - MARGIN * 2,
      this.y + MARGIN * 2,
      ICON_SIZE,
      ICON_SIZE,
      "↺",
      () => {
        this.visible = false;
        window.location.reload();
      }
    );

    this.toolbar = new Toolbar(
      this.x + MARGIN,
      this.y + TITLEBAR_H + MARGIN * 2,
      TOOLBAR_W,
      this.h - PALETTE_H - TITLEBAR_H
    );

    this.palette = new Palette(
      this.x + MARGIN,
      this.y + this.h - PALETTE_H - MARGIN,
      this.w - MARGIN * 2,
      PALETTE_H
    );

    this.canvas = new Canvas(
      this.x + TOOLBAR_W + PADDING * 2,
      this.y + TITLEBAR_H + PADDING * 2,
      this.w - TOOLBAR_W - CANVAS_GAP,
      this.h - PALETTE_H - TITLEBAR_H - CANVAS_GAP
    );
  }

  resize(newWidth, newHeight) {
    this.w = newWidth;
    this.h = newHeight;
    
    this.closeButton.x = this.x + this.w - ICON_SIZE - MARGIN * 2;
    this.closeButton.y = this.y + MARGIN * 2;

    this.toolbar.x = this.x + MARGIN;
    this.toolbar.y = this.y + TITLEBAR_H + MARGIN * 2;
    this.toolbar.w = TOOLBAR_W;
    this.toolbar.h = this.h - PALETTE_H - TITLEBAR_H;

    //re-instanciando o Palette para que a formatação fique correta ao dar zoom no navegador
    this.palette = new Palette(
      this.x + MARGIN,
      this.y + this.h - PALETTE_H - MARGIN,
      this.w - MARGIN * 2,
      PALETTE_H
    );

    this.palette.x = this.x + MARGIN;
    this.palette.y = this.y + this.h - PALETTE_H - MARGIN;
    this.palette.w = this.w - MARGIN * 0.5;
    this.palette.h = PALETTE_H + 2;

    this.canvas.resizeBuffer(canvasWidth, canvasHeight);
  }

  draw() {
    if (!this.visible) return;
    
    // criando cor customizada e aplicando
    let mediumBluishGrey = color(127, 153, 178);

    fill(mediumBluishGrey);
    stroke("black");
    rect(this.x, this.y, this.w, this.h);

    // construindo elementos
    this.drawTitleBar();
    this.closeButton.draw();
    this.toolbar.draw();

    // Criando um fundo escuro pro Canvas
    let darkBluishGrey = color(12, 52, 91);
    fill(darkBluishGrey);
    noStroke();
    rect(
      this.x + TOOLBAR_W + PADDING / 2,
      this.y + TITLEBAR_H + MARGIN + PADDING / 2,
      this.w - TOOLBAR_W - PADDING,
      this.h - PALETTE_H - TITLEBAR_H - PADDING - MARGIN
    );
    
    this.canvas.display();
    this.palette.draw();
  }

  drawTitleBar() {

    let titleBluishGrey = color(78, 100, 124);
    fill(titleBluishGrey);
    rect(
      this.x + PADDING / 2,
      this.y + PADDING / 2,
      this.w - PADDING,
      TITLEBAR_H
    );


    // Construindo o icone do titulo
    image(
      icon,
      this.x + MARGIN * 2,
      this.y + MARGIN * 2,
      ICON_SIZE,
      ICON_SIZE
    );

    // Titulo da janela
    fill("white");
    noStroke();
    textSize(12);
    textAlign(LEFT, CENTER);
    textFont("Courier New");
    textStyle(BOLD);
    const x = this.x + ICON_SIZE + MARGIN * 5;
    const y = this.y + TITLEBAR_H - PADDING * 1.5;
    text(this.title, x, y);
  }

  mousePressed(mx, my) {
    this.closeButton.mousePressed(mx, my);
    this.palette.mousePressed(mx, my);
    this.toolbar.mousePressed(mx, my);
    this.canvas.mousePressed(mx, my);
  }

  mouseDragged(mx, my) {
    this.canvas.mouseDragged(mx, my);
  }

  mouseReleased() {
    this.canvas.mouseReleased();
  }
}

class Button {
  constructor(
    x,
    y,
    w,
    h,
    label,
    action,
    fillColor = null,
    img = null
  ) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.label = label;
    this.action = action;
    this.fillColor = fillColor;
    this.img = img;
  }

  draw() {
    if (this.img != null) {
      // Ajusta o tamanho da imagem para se adequar ao botão
      let imgWidth = min(this.img.width, this.w);
      let imgHeight = min(this.img.height, this.h);

      // Calcula a posição para centralizar a imagem
      let imgX = this.x + this.w / 2 - imgWidth / 2;
      let imgY = this.y + this.h / 2 - imgHeight / 2;

      // faz a imagem
      image(
        this.img,
        imgX,
        imgY,
        imgWidth,
        imgHeight
      );
    } else {
      let mediumBluishGrey = color(127, 153, 178);
      fill(this.fillColor ? this.fillColor : mediumBluishGrey);
      stroke('black');
      rect(this.x, this.y, this.w, this.h);
      if (!this.fillColor) {
        fill('black');
        textSize(10);
        textAlign(CENTER, CENTER);
        text(
          this.label,
          this.x + this.w / 2,
          this.y + this.h / 2
        );
      }
    }
  }

  mousePressed(mx, my) {
    if (
      mx > this.x &&
      mx < this.x + this.w &&
      my > this.y &&
      my < this.y + this.h
    ) {
      this.action();
    }
  }
}

class ToolbarButton extends Button {
  constructor(
    x,
    y,
    w,
    h,
    label,
    action,
    fillColor = null,
    img = null,
    onImg = null
  ) {
    super(x, y, w, h, label, action, fillColor, img);
    this.onImg = onImg;
  }

  draw() {
    if (currentTool === this.label && this.onImg != null) {
      let imgWidth = min(this.onImg.width, this.w);
      let imgHeight = min(this.onImg.height, this.h);

      let imgX = this.x + this.w / 2 - imgWidth / 2;
      let imgY = this.y + this.h / 2 - imgHeight / 2;

      image(
        this.onImg,
        imgX,
        imgY,
        imgWidth,
        imgHeight
      );
    } else {
      let imgWidth = min(this.img.width, this.w);
      let imgHeight = min(this.img.height, this.h);

      let imgX = this.x + this.w / 2 - imgWidth / 2;
      let imgY = this.y + this.h / 2 - imgHeight / 2;

      image(
        this.img,
        imgX,
        imgY,
        imgWidth,
        imgHeight
      );
    }
  }
}

class Toolbar {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.toolButtons = [];

    // Cria um objeto ToolbarButton para cada ferramenta.
    AVAILABLE_TOOLS.forEach((toolName, i) => {
      const row = floor(i / 2);
      const col = i % 2;
      this.toolButtons.push(
        new ToolbarButton(
          this.x + 5 + col * TOOLBAR_BUTTON_SIZE,
          this.y + 5 + row * TOOLBAR_BUTTON_SIZE,
          TOOLBAR_BUTTON_SIZE,
          TOOLBAR_BUTTON_SIZE,
          toolName,
          () => {
            currentTool = toolName;
          },
          null,
          toolIcons[toolName][0],
          toolIcons[toolName][1]
        )
      );
    });
  }

  draw() {
    let mediumBluishGrey = color(127, 153, 178);
    fill(mediumBluishGrey);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
    this.toolButtons.forEach((button) => button.draw());
  }

  mousePressed(mx, my) {
    this.toolButtons.forEach((button) =>
      button.mousePressed(mx, my)
    );
  }
}

class Palette {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.colorButtons = [];
    

    // Cria um objeto Button para cada cor
    const endFirstRow = WEB_COLORS.length / 2;
    WEB_COLORS.forEach((colorName, i) => {
      let row = i < endFirstRow ? 0 : 1;
      let col = row > 0 ? i - endFirstRow : i;
      let x =
        this.x +
        this.h +
        col * PALETTE_BUTTON_SIZE +
        col * MARGIN * 2;
      let y =
        this.y +
        row * PALETTE_BUTTON_SIZE +
        PADDING * 2 +
        (row > 0 ? MARGIN * 2 : 0);
      this.colorButtons.push(
        new Button(
          x,
          y,
          PALETTE_BUTTON_SIZE,
          PALETTE_BUTTON_SIZE,
          colorName,
          () => {
            currentColor = colorName;
          },
          colorName
        )
      );
    });
  }

  draw() {
    let mediumBluishGrey = color(127, 153, 178);
    noStroke();
    fill(mediumBluishGrey);
    rect(this.x, this.y, this.w, this.h);

    // Cria uma caixa pra cor selecionada atual
    let lightBluishGrey = color(155, 181, 194);
    stroke('black');
    fill(lightBluishGrey);
    rect(
      this.x + PADDING * 2,
      this.y + PADDING * 2,
      this.h - PADDING * 4,
      this.h - PADDING * 4
    );

    // Cria uma sombra na caixa
    fill(mediumBluishGrey);
    const offset = this.h / 2 - this.h / 6;
    const s = PALETTE_BUTTON_SIZE;
    rect(
      this.x + offset + MARGIN,
      this.y + offset + MARGIN,
      s,
      s
    );

    // Cria a cor em sí
    fill(currentColor);
    rect(this.x + offset, this.y + offset, s, s);

    // Cria cada cor
    this.colorButtons.forEach((button) => button.draw());
  }

  mousePressed(mx, my) {
    this.colorButtons.forEach((button) =>
      button.mousePressed(mx, my)
    );
  }
}

class Canvas {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    // Faz um objeto p5.Graphics pra guardar o desenho do usuário
    this.buffer = createGraphics(w, h);
    this.buffer.background("white");

    // Variáveis para controlar o preview
    this.previewX = null;
    this.previewY = null;
  }

  resizeBuffer(newWidth, newHeight) {
    this.w = newWidth;
    this.h = newHeight;
    this.setBufferPixelDensity(1);
    this.buffer = createGraphics(newWidth, newHeight);
    this.buffer.background("white");
  }

  display() {
    fill("white");
    rect(this.x, this.y, this.w, this.h);
    image(this.buffer, this.x, this.y);

    // Desenha o preview da forma geométrica, se estiver desenhando
    if (this.isDrawingGeometry() && this.previewX !== null && this.previewY !== null) {
      this.drawShape(
        currentTool,
        //enviando as variáveis com a posição do mouse já corrigida
        this.drawingX + this.x,
        this.drawingY + this.y,
        this.previewX + this.x,
        this.previewY + this.y,
        false // Não persiste no buffer, apenas desenha o preview
      );
    }
  }

  mouseInsideCanvas(mx, my) {
    return (
      mx >= this.x &&
      mx <= this.x + this.w &&
      my >= this.y &&
      my <= this.y + this.h
    );
  }

  isDrawingGeometry() {
    return this.drawingX !== null;
  }

  strokeWeight() {
    return currentTool === "brush" ? 5 : 1;
  }

  replaceBufferWithFreshCanvas() {
    let newBuffer = createGraphics(this.w, this.h);
    newBuffer.image(this.buffer, 0, 0);
    this.buffer = newBuffer;
  }

  beginGeometry(x, y) {
    this.drawingX = x;
    this.drawingY = y;
    this.previewX = null;
    this.previewY = null;
  }

  endGeometry(x, y) {
    if (this.isDrawingGeometry()) {
      this.drawShape(
        currentTool,
        this.drawingX,
        this.drawingY,
        x,
        y
      );
    }
    this.drawingX = null;
    this.drawingY = null;
    this.previewX = null;
    this.previewY = null;
  }

  drawShape(shape, x1, y1, x2, y2, persist = true) {
    let c = persist ? this.buffer : window;
    c.stroke(currentColor);
    c.strokeWeight(this.strokeWeight());

    switch (shape) {
      case "line":
        c.line(x1, y1, x2, y2);
        break;
      case "rect":
        c.noFill();
        c.rect(x1, y1, x2 - x1, y2 - y1);
        break;
      case "circle":
        c.noFill();
        let radiusX = (x2 - x1) / 2;
        let radiusY = (y2 - y1) / 2;
        c.ellipse(
          x1 + radiusX,
          y1 + radiusY,
          Math.abs(radiusX * 2),
          Math.abs(radiusY * 2)
        );
        break;
    }
  }

  mousePressed(mx, my) {
    if (!this.mouseInsideCanvas(mx, my)) return;

    // Ajusta o mx e o my para serem relativos ao desenho do canvas
    const adjustedX = mx - this.x;
    const adjustedY = my - this.y;
    this.lastX = adjustedX;
    this.lastY = adjustedY;

    switch (currentTool) {
      case "paint":
        this.paint(adjustedX, adjustedY);
        break;
      case "pencil":
      case "brush":
        this.buffer.stroke(currentColor);
        this.buffer.strokeWeight(this.strokeWeight());
        this.buffer.point(adjustedX, adjustedY);
        break;
      case "line":
      case "rect":
      case "circle":
        this.beginGeometry(adjustedX, adjustedY);
        break;
      case "spray":
        this.sprayPaint(adjustedX, adjustedY);
        break;
    }
  }

  mouseDragged(mx, my) {
    if (!this.mouseInsideCanvas(mx, my)) return;

    const adjustedX = mx - this.x;
    const adjustedY = my - this.y;

    switch (currentTool) {
      case "spray":
        this.sprayPaint(
          mx - this.x,
          my - this.y,
          currentColor
        );
        break;
      case "eraser":
        this.eraser(
          pmouseX - this.x,
          pmouseY - this.y,
          mx - this.x,
          my - this.y
        );
        break;
      case "pencil":
      case "brush":
        // Desenha na tela apenas se tivermos uma posição anterior
        if (this.lastX !== null && this.lastY !== null) {
          this.buffer.stroke(currentColor);
          this.buffer.strokeWeight(this.strokeWeight());
          this.buffer.line(
            this.lastX,
            this.lastY,
            adjustedX,
            adjustedY
          );
        }

        // Atualiza a posição anterior
        this.lastX = adjustedX;
        this.lastY = adjustedY;
        break;
      case "line":
      case "rect":
      case "circle":
        // Atualiza as coordenadas de preview enquanto o mouse é arrastado
        this.previewX = adjustedX;
        this.previewY = adjustedY;
        break;
    }
  }

  mouseReleased() {
    this.lastX = null;
    this.lastY = null;
    if (!this.mouseInsideCanvas(mouseX, mouseY)) return;
    if (this.isDrawingGeometry()) {
      // Renderiza o que acabou de ser desenhado
      this.endGeometry(mouseX - this.x, mouseY - this.y);
    }
  }

  sprayPaint(x, y) {
    let density = 50; // Pontos por "frame"
    let radius = 10; // Distancia maxima do centro
    this.buffer.stroke(currentColor);
    this.buffer.strokeWeight(1); // Tamanho de cada ponto
    for (let i = 0; i < density; i++) {
      // Calcula posição aleatória para cada ponto
      let angle = random(TWO_PI); // Angulo aleatório
      let r = random(radius); // Distancia do centro
      let offsetX = r * cos(angle);
      let offsetY = r * sin(angle);
      this.buffer.point(x + offsetX, y + offsetY);
    }
  }

  eraser(x1, y1, x2, y2, strokeWeightVal = 10) {
    // Assumindo que o fundo é branco
    this.buffer.stroke(255, 255, 255);
    this.buffer.strokeWeight(strokeWeightVal);
    this.buffer.line(x1, y1, x2, y2);
  }

  paint(x, y) {
    const newColor = color(currentColor);
    this.buffer.loadPixels();
    const pixelDensity = this.buffer.pixelDensity();

    // Normaliza as coordenadas de entrada para lidar com densidade de pixels
    const normalizedX = Math.floor(x * pixelDensity);
    const normalizedY = Math.floor(y * pixelDensity);
    const targetColor = this.buffer.get(normalizedX, normalizedY);

    // Converte a nova cor e a cor alvo para RGB
    const newColorRGB = [red(newColor), green(newColor), blue(newColor)];
    const targetColorRGB = [red(targetColor), green(targetColor), blue(targetColor)];

    // Checa se a cor alvo é igual à nova cor
    if (this.colorsEqual(targetColorRGB, newColorRGB, 0)) {
        this.buffer.updatePixels();
        return;
    }

    const width = this.buffer.width * pixelDensity;
    const height = this.buffer.height * pixelDensity;
    const pixelVisited = new Uint8Array(width * height);
    const stack = [[normalizedX, normalizedY]];

    const pixels = this.buffer.pixels;

    while (stack.length > 0) {
        const [cx, cy] = stack.pop();
        const idx = cy * width + cx;

        if (cx < 0 || cy < 0 || cx >= width || cy >= height) continue;
        if (pixelVisited[idx]) continue;

        pixelVisited[idx] = 1;

        const pixelIndex = idx * 4;
        const pixelColorRGB = [
            pixels[pixelIndex],         // Red
            pixels[pixelIndex + 1],     // Green
            pixels[pixelIndex + 2]      // Blue
        ];

        if (!this.colorsEqual(pixelColorRGB, targetColorRGB, 0)) continue;

        // Atualiza a cor na matriz de pixels
        pixels[pixelIndex] = newColorRGB[0];
        pixels[pixelIndex + 1] = newColorRGB[1];
        pixels[pixelIndex + 2] = newColorRGB[2];

        // Adiciona os pixels vizinhos à pilha
        stack.push([cx + 1, cy]);
        stack.push([cx - 1, cy]);
        stack.push([cx, cy + 1]);
        stack.push([cx, cy - 1]);
    }

    this.buffer.updatePixels();
    this.replaceBufferWithFreshCanvas();
}

  // Método para ajudar a normalizar as cores
  normalizeColor(color) {
    if (color instanceof p5.Color) {
      return [
        red(color),
        green(color),
        blue(color),
        alpha(color),
      ];
    } else {
      if (color.length === 3) {
        return [...color, 255];
      }
      return color;
    }
  }

  // Método para ajudar a checar se 2 cores são iguais
  colorsEqual(col1, col2, tolerance = 10) {
    col1 = this.normalizeColor(col1);
    col2 = this.normalizeColor(col2);

    return (
      Math.abs(col1[0] - col2[0]) <= tolerance &&
      Math.abs(col1[1] - col2[1]) <= tolerance &&
      Math.abs(col1[2] - col2[2]) <= tolerance &&
      Math.abs(col1[3] - col2[3]) <= tolerance
    );
  }
}

let canvas;
let buffer;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  paintWindow = new PaintWindow(
    0,
    0,
    windowWidth,
    windowHeight,
    "untitled - Paint"
  );
  buffer = createGraphics(width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  paintWindow.resize(windowWidth, windowHeight);
  paintWindow.initializeComponents();
}

function draw() {
  background("teal");
  paintWindow.draw();
  image(buffer, 0, 0);
}

function mousePressed() {
  paintWindow.mousePressed(mouseX, mouseY);
}

function mouseDragged() {
  paintWindow.mouseDragged(mouseX, mouseY);
}

function mouseReleased() {
  paintWindow.mouseReleased();
}
