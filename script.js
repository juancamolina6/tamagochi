document.addEventListener('DOMContentLoaded', () => {
  const hambreBar = document.getElementById('hambre');
  const cansancioBar = document.getElementById('cansancio');
  const juegoComida = document.getElementById('juegoComida');
  const juegoVallas = document.getElementById('juegoVallas');
  const puntosDisplayComida = document.getElementById('puntosComida');
  const vidasDisplayComida = document.getElementById('vidasComida');
  const puntosDisplayVallas = document.getElementById('puntosVallas');
  const canvasComida = document.getElementById('canvasComida');
  const canvasVallas = document.getElementById('canvasVallas');
  const ctxComida = canvasComida.getContext('2d');
  const ctxVallas = canvasVallas.getContext('2d');
  const personajeComida = {
    x: canvasComida.width / 2,
    y: canvasComida.height - 30,
    width: 30,
    height: 30,
  };
  const personajeVallas = {
    x: 50,
    y: canvasVallas.height - 40,
    width: 30,
    height: 30,
    vy: 0,
    onGround: true,
  };
  const comida = [];
  const objetosIncorrectos = [];
  const vallas = [];
  let puntosComida = 0;
  let vidasComida = 3;
  let puntosVallas = 0;
  let juegoActivo = false;
  let jugandoComida = false;
  let jugandoVallas = false;
  let statsInterval;
  let velocidadComida = 2;
  let velocidadVallas = 5;
  let gravedad = 1;
  let salto = 15;

  // Cargar la imagen del pastelito
  const pastelitoImg = new Image();
  pastelitoImg.src = './img/pastel.png';

  // Cargar la imagen de la piedra
  const piedraImg = new Image();
  piedraImg.src = './img/piedra.png';

  // Cargar la imagen de fondo
  const fondoImg = new Image();
  fondoImg.src = './img/fondo.jpg';

  // Cargar la imagen del personaje
  const personajeImg = new Image();
  personajeImg.src = './img/GatoJuegoComida.png';

  // Cargar la imagen de la valla
  const vallaImg = new Image();
  vallaImg.src = './img/valla.png';

  // Obtener referencias a las imágenes del estado
  const durmiendoImg = document.getElementById('durmiendoImg');
  const hambreImg = document.getElementById('hambreImg');
  const enojadoImg = document.getElementById('enojadoImg');
  const enfermoImg = document.getElementById('enfermoImg');

  function startGameComida() {
    juegoComida.style.display = 'block';
    juegoVallas.style.display = 'none';
    juegoActivo = true;
    jugandoComida = true;
    puntosComida = 0;
    vidasComida = 3;
    velocidadComida = 2; // Restablecer la velocidad al inicio del juego
    updateDisplaysComida();
    animateComida();
    clearInterval(statsInterval); // Parar la disminución de las barras mientras se juega
  }

  function endGameComida() {
    juegoComida.style.display = 'none';
    juegoActivo = false;
    jugandoComida = false;
    hambreBar.value = Math.min(100, hambreBar.value + puntosComida);
    resetGameComida();
    statsInterval = setInterval(decreaseStats, 1000); // Reiniciar la disminución de las barras después del juego
  }

  function startGameVallas() {
    juegoVallas.style.display = 'block';
    juegoComida.style.display = 'none';
    juegoActivo = true;
    jugandoVallas = true;
    puntosVallas = 0;
    velocidadVallas = 5; // Restablecer la velocidad al inicio del juego
    personajeVallas.y = canvasVallas.height - 40;
    personajeVallas.vy = 0;
    personajeVallas.onGround = true;
    updateDisplaysVallas();
    animateVallas();
    clearInterval(statsInterval); // Parar la disminución de las barras mientras se juega
  }

  function endGameVallas() {
    juegoVallas.style.display = 'none';
    juegoActivo = false;
    jugandoVallas = false;
    cansancioBar.value = Math.min(100, cansancioBar.value + puntosVallas);
    resetGameVallas();
    statsInterval = setInterval(decreaseStats, 1000); // Reiniciar la disminución de las barras después del juego
  }

  function updateDisplaysComida() {
    puntosDisplayComida.textContent = puntosComida;
    vidasDisplayComida.textContent = vidasComida;
  }

  function updateDisplaysVallas() {
    puntosDisplayVallas.textContent = puntosVallas;
  }

  function drawPersonajeComida() {
    ctxComida.drawImage(
      personajeImg,
      personajeComida.x,
      personajeComida.y,
      personajeComida.width,
      personajeComida.height
    );
  }

  function drawPersonajeVallas() {
    ctxVallas.drawImage(
      personajeImg,
      personajeVallas.x,
      personajeVallas.y,
      personajeVallas.width,
      personajeVallas.height
    );
  }

  function drawComida() {
    comida.forEach((obj) => {
      ctxComida.drawImage(pastelitoImg, obj.x, obj.y, obj.width, obj.height);
    });
  }

  function drawObjetosIncorrectos() {
    objetosIncorrectos.forEach((obj) => {
      ctxComida.drawImage(piedraImg, obj.x, obj.y, obj.width, obj.height);
    });
  }

  function drawVallas() {
    vallas.forEach((obj) => {
      ctxVallas.drawImage(vallaImg, obj.x, obj.y, obj.width, obj.height);
    });
  }

  function generateRandomItem() {
    const x = Math.random() * (canvasComida.width - 20);
    const itemType = Math.random() < 0.5 ? 'comida' : 'piedra';
    if (itemType === 'comida') {
      comida.push({ x: x, y: 0, width: 20, height: 20 });
    } else {
      objetosIncorrectos.push({ x: x, y: 0, width: 20, height: 20 });
    }
  }

  function generateRandomValla() {
    const x = canvasVallas.width;
    vallas.push({ x: x, y: canvasVallas.height - 60, width: 20, height: 20 });
  }

  function updateComida() {
    comida.forEach((obj) => (obj.y += velocidadComida));
    objetosIncorrectos.forEach((obj) => (obj.y += velocidadComida));
  }

  function updateVallas() {
    vallas.forEach((obj, index) => {
      obj.x -= velocidadVallas;
      if (obj.x + obj.width < 0) {
        vallas.splice(index, 1);
        puntosVallas++;
        updateDisplaysVallas();
        if (puntosVallas % 5 === 0) {
          velocidadVallas += 1; // Aumentar la velocidad cada 5 puntos
        }
      }
      // Aplicar gravedad al personaje
      if (!personajeVallas.onGround) {
        personajeVallas.vy += gravedad;
      }

      personajeVallas.y += personajeVallas.vy;

      // Detectar si el personaje ha tocado el suelo
      if (
        personajeVallas.y + personajeVallas.height >=
        canvasVallas.height - 40
      ) {
        personajeVallas.y = canvasVallas.height - 40 - personajeVallas.height;
        personajeVallas.vy = 0;
        personajeVallas.onGround = true;
      }
    });
  }

  function detectCollisionComida() {
    comida.forEach((obj, index) => {
      if (
        obj.x < personajeComida.x + personajeComida.width &&
        obj.x + obj.width > personajeComida.x &&
        obj.y < personajeComida.y + personajeComida.height &&
        obj.y + obj.height > personajeComida.y
      ) {
        comida.splice(index, 1);
        puntosComida++;
        updateDisplaysComida();
        if (puntosComida % 5 === 0) {
          velocidadComida += 1; // Aumentar la velocidad cada 5 puntos
        }
        if (puntosComida >= 20) {
          alert('¡Has ganado!');
          endGameComida();
        }
      }
    });

    objetosIncorrectos.forEach((obj, index) => {
      if (
        obj.x < personajeComida.x + personajeComida.width &&
        obj.x + obj.width > personajeComida.x &&
        obj.y < personajeComida.y + personajeComida.height &&
        obj.y + obj.height > personajeComida.y
      ) {
        objetosIncorrectos.splice(index, 1);
        vidasComida--;
        updateDisplaysComida();
        if (vidasComida <= 0) {
          alert('¡Has perdido!');
          endGameComida();
        }
      }
    });
  }

  function detectCollisionVallas() {
    vallas.forEach((obj, index) => {
      if (
        obj.x < personajeVallas.x + personajeVallas.width &&
        obj.x + obj.width > personajeVallas.x &&
        obj.y < personajeVallas.y + personajeVallas.height &&
        obj.y + obj.height > personajeVallas.y
      ) {
        alert('¡Has perdido!');
        endGameVallas();
      }
    });
  }

  function resetGameComida() {
    puntosComida = 0;
    vidasComida = 3;
    comida.length = 0;
    objetosIncorrectos.length = 0;
  }

  function resetGameVallas() {
    puntosVallas = 0;
    vallas.length = 0;
  }

  function animateComida() {
    if (!juegoActivo) return;
    ctxComida.clearRect(0, 0, canvasComida.width, canvasComida.height);
    ctxComida.drawImage(
      fondoImg,
      0,
      0,
      canvasComida.width,
      canvasComida.height
    );
    drawPersonajeComida();
    drawComida();
    drawObjetosIncorrectos();
    updateComida();
    detectCollisionComida();
    requestAnimationFrame(animateComida);
  }

  function animateVallas() {
    if (!juegoActivo) return;
    ctxVallas.clearRect(0, 0, canvasVallas.width, canvasVallas.height);
    ctxVallas.drawImage(
      fondoImg,
      0,
      0,
      canvasVallas.width,
      canvasVallas.height
    );
    drawPersonajeVallas();
    drawVallas();
    updateVallas();
    detectCollisionVallas();
    requestAnimationFrame(animateVallas);
  }

  function decreaseStats() {
    if (jugandoComida || jugandoVallas) return; // No disminuir las barras si estamos en un juego

    if (hambreBar.value > 0) hambreBar.value -= 1;
    if (cansancioBar.value > 0) cansancioBar.value -= 1;

    updateEstadoImagenes();

    if (hambreBar.value === 0 && cansancioBar.value === 0) {
      alert('¡Tu Tamagotchi ha muerto!');
      resetGameComida();
      resetGameVallas();
      clearInterval(statsInterval);
    }
  }

  function updateEstadoImagenes() {
    durmiendoImg.style.display = 'none';
    hambreImg.style.display = 'none';
    enojadoImg.style.display = 'none';
    enfermoImg.style.display = 'none';

    if (hambreBar.value < 10 || cansancioBar.value < 10) {
      enfermoImg.style.display = 'block';
    } else if (hambreBar.value < 25 || cansancioBar.value < 25) {
      enojadoImg.style.display = 'block';
    } else if (hambreBar.value < 50 || cansancioBar.value < 50) {
      if (hambreBar.value < 50) {
        hambreImg.style.display = 'block';
      }
      if (cansancioBar.value < 50) {
        durmiendoImg.style.display = 'block';
      }
    }
  }

  statsInterval = setInterval(decreaseStats, 1000);

  document
    .getElementById('startJuegoComida')
    .addEventListener('click', startGameComida);
  document
    .getElementById('endJuegoComida')
    .addEventListener('click', endGameComida);
  document
    .getElementById('startJuegoVallas')
    .addEventListener('click', startGameVallas);
  document
    .getElementById('endJuegoVallas')
    .addEventListener('click', endGameVallas);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      if (jugandoComida && personajeComida.x > 0) {
        personajeComida.x -= 10;
      }
    }
    if (e.key === 'ArrowRight') {
      if (
        jugandoComida &&
        personajeComida.x < canvasComida.width - personajeComida.width
      ) {
        personajeComida.x += 10;
      }
    }
    if (e.key === ' ') {
      if (jugandoVallas && personajeVallas.onGround) {
        personajeVallas.vy = -salto;
        personajeVallas.onGround = false;
      }
    }
  });

  setInterval(generateRandomItem, 2000);
  setInterval(generateRandomValla, 3000);
});
