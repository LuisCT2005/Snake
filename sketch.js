
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
  let canvas = createCanvas(600, 600);
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
  frameRate(5);
  tamañoX = width / cols;
  tamañoY = height / rows;

  manzana = {
    x: floor(random(cols)),
    y: floor(random(rows)),
  };
  
  let inicioX = 0;
  let inicioY = floor(rows/2);
  for (let i = 0; i < longitud; i++){
   serpiente.push({x : inicioX + i, y: inicioY});
  }
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