const cols = 15;
const rows = 17;


let longitud = 4;
let serpiente = [];
let direccion = {x:1, y:0};
let direccionPendiente = { x: 1, y: 0 };
let tamañoX;
let tamañoY;
let juegoTerminado = false;
let manzana;

let pulsado;

function setup() {
  let canvas = createCanvas(min(windowWidth, windowHeight)*0.8, min(windowWidth, windowHeight)*0.8);
  canvas.position((windowWidth - width) / 2 + 20, (windowHeight - height) / 2 + 20);
  frameRate(5);
  tamañoX = width / cols;
  tamañoY = height / rows;

  manzana = {
    x: floor(random(cols)),
    y: floor(random(rows)),
  };

  let inicioX = 0;
  let inicioY = floor(rows / 2);
  for (let i = 0; i < longitud; i++) {
    serpiente.push({ x: inicioX + i, y: inicioY });
  }

  // Add touch event listeners for mobile controls
  canvas.elt.addEventListener("touchstart", handleTouchStart, false);
  canvas.elt.addEventListener("touchmove", handleTouchMove, false);
}

function draw() {
  background(50);
  actualizarSerpiente();

  controlManzana();
  dibujarSerpiente();
  if (isGameOver()) {
    mostrarTextoFinal();
  }
}

function handleTouchStart(event) {
  event.preventDefault(); // Evita el desplazamiento de la página

  if (juegoTerminado) {
    iniciarJuego(); // Reinicia el juego si está terminado
    return;
  }

  const touch = event.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}

function handleTouchMove(event) {
  event.preventDefault(); // Evita el desplazamiento de la página
  if (!touchStartX || !touchStartY) return;

  const touch = event.touches[0];
  const touchEndX = touch.clientX;
  const touchEndY = touch.clientY;

  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Horizontal swipe
    if (diffX > 0 && direccion.x === 0) {
      direccionPendiente = { x: 1, y: 0 }; // Swipe right
    } else if (diffX < 0 && direccion.x === 0) {
      direccionPendiente = { x: -1, y: 0 }; // Swipe left
    }
  } else {
    // Vertical swipe
    if (diffY > 0 && direccion.y === 0) {
      direccionPendiente = { x: 0, y: 1 }; // Swipe down
    } else if (diffY < 0 && direccion.y === 0) {
      direccionPendiente = { x: 0, y: -1 }; // Swipe up
    }
  }

  // Reset touch start coordinates
  touchStartX = null;
  touchStartY = null;
}


function windowResized() {
  resizeCanvas(min(windowWidth, windowHeight)*0.5 , min(windowWidth, windowHeight))*0.5;
  tamañoX = width / cols;
  tamañoY = height / rows;
}
function iniciarJuego() {
  // Reiniciar todas las variables del juego
  longitud = 4;
  serpiente = [];
  direccion = { x: 1, y: 0 };
  direccionPendiente = { x: 1, y: 0 };
  juegoTerminado = false;

  manzana = {
    x: floor(random(cols)),
    y: floor(random(rows)),
  };

  let inicioX = 0;
  let inicioY = floor(rows / 2);
  for (let i = 0; i < longitud; i++) {
    serpiente.push({ x: inicioX + i, y: inicioY });
  }

  loop(); // Reiniciar el bucle de dibujo
}

function isGameOver() {

  return juegoTerminado;
}

function mostrarTextoFinal() {
  textSize(50);
  textAlign(CENTER, CENTER);
  fill(255, 0, 0);
  text(`Perdiste`,width / 2, height / 2-150)
  text(`Longitud = ${longitud}`, width / 2, height / 2-75);
  text(`Espacio para reiniciar`,width / 2, height / 2 + 100)
}

function actualizarSerpiente(){
  if (
    (direccionPendiente.x !== -direccion.x || direccionPendiente.y !== -direccion.y)
  ) {
    direccion = direccionPendiente;
  }


  let cabeza = serpiente[serpiente.length -1];
  let nuevaCabeza = {
    x: cabeza.x + direccion.x,
    y: cabeza.y + direccion.y,
  };

  if (nuevaCabeza.x < 0 || nuevaCabeza.x >= cols){
    juegoTerminado = true;
    noLoop();
    return;
  } else if (nuevaCabeza.y < 0 ||nuevaCabeza.y >= rows){
    juegoTerminado = true;
    noLoop();
    return;
  }
  for(let segmento of serpiente){
    if (nuevaCabeza.x == segmento.x && nuevaCabeza.y == segmento.y){
      juegoTerminado = true;
      noLoop();
      return;
    }
  }
  serpiente.push(nuevaCabeza);
  serpiente.shift();
}

function dibujarSerpiente(){
  fill(255);
  stroke(255);
  for (let segmento of serpiente){
    rect(segmento.x * tamañoX, segmento.y * tamañoY, tamañoX, tamañoY);
  }
}


function keyPressed() {
  if (keyCode === UP_ARROW && direccion.y === 0) {
    direccionPendiente = { x: 0, y: -1 };
  } else if (keyCode === DOWN_ARROW && direccion.y === 0) {
    direccionPendiente = { x: 0, y: 1 };
  } else if (keyCode === RIGHT_ARROW && direccion.x === 0) {
    direccionPendiente = { x: 1, y: 0 };
  } else if (keyCode === LEFT_ARROW && direccion.x === 0) {
    direccionPendiente = { x: -1, y: 0 };
  }

  if(keyCode === 32 && juegoTerminado){
    iniciarJuego();
  }
}

function controlManzana(){
 fill(255,0,0);
 stroke(255,0,0);
 rect(manzana.x*tamañoX,manzana.y*tamañoY,tamañoX,tamañoY);
 let cabeza = serpiente[serpiente.length -1];
 if (cabeza.x == manzana.x && cabeza.y == manzana.y){
   longitud++;
   do {
    manzana.x = floor(random(cols));
    manzana.y = floor(random(rows));
  } while (serpiente.some(segmento => segmento.x === manzana.x && segmento.y === manzana.y));
   
   let cola = serpiente[0];
    serpiente.unshift({ x: cola.x, y: cola.y });
 }
}