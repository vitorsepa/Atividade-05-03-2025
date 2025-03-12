// pegando o canvas do html
const canvas = document.getElementById('jogo2d');

// iniciando o canvas
const ctx = canvas.getContext('2d');
const gravidade = 0.8;
let gameOver = false;  // Controle de game over

// Carregar imagem de Game Over
const gameOverImage = new Image();
gameOverImage.src = 'gameover.png';  // Caminho da imagem de Game Over

// ao apertar a tecla espaço e o personagem não estiver pulando, vai conceder o pulo
document.addEventListener('keypress', (e) => {
    if (e.code == 'Space' && personagem.pulando == false) {
        personagem.velocidadey = 15;
        personagem.pulando = true;
    }
});

document.addEventListener('click', (e) => {
    if (gameOver == true) {
        location.reload();  // Recarrega o jogo quando clicar após o Game Over
    }
});

// status do personagem
const personagem = {
    x: 100,
    y: canvas.height - 143,
    altura: 50,
    largura: 50,
    velocidadey: 0,
    pulando: false,
    imagem: new Image()
};

personagem.imagem.src = 'download.png';

// Função para desenhar o personagem
function desenharPersonagem() {
    ctx.drawImage(personagem.imagem, personagem.x, personagem.y, personagem.altura, personagem.largura);
}

// Verifica se o personagem está pulando e então atualiza a velocidade e sua posição
function atualizarPersonagem() {
    if (personagem.pulando == true) {
        personagem.velocidadey -= gravidade;
        personagem.y -= personagem.velocidadey;

        // conceito de chão
        if (personagem.y >= canvas.height - 143) {
            personagem.velocidadey = 0;
            personagem.pulando = false;
            personagem.y = canvas.height - 143;
        }
    }
}

// Obstáculos
const obstaculos = [];
const velocidadeBase = 3;  // Velocidade inicial dos obstáculos
let tempo = 0;  // Tempo para aumentar a velocidade exponencialmente

function criarObstaculo() {
    let novoObstaculoX = canvas.width + Math.random() * 200;  // Posição inicial aleatória mais à direita
    const distanciaMinima = 100;  // Distância mínima entre os obstáculos

    // Verificar se o novo obstáculo está muito perto dos existentes
    for (let i = 0; i < obstaculos.length; i++) {
        if (novoObstaculoX - obstaculos[i].x < distanciaMinima) {
            novoObstaculoX = obstaculos[i].x + distanciaMinima;
        }
    }

    // Criar o novo obstáculo com a posição corrigida
    const obstaculo = {
        imagem2: new Image(),
        x: novoObstaculoX, 
        y: canvas.height - 138,
        altura: 50,
        largura: 50,
        velocidadex: velocidadeBase, 
    };

    obstaculo.imagem2.src = 'https://i.redd.it/geometry-dash-spike-he-him-v0-xo3gm3moyo7d1.png?width=1280&format=png&auto=webp&s=a1f2e035e42acec99757c57d80aa17197ae22613';
    obstaculos.push(obstaculo);
}

function atualizarObstaculos() {
    tempo += 0.001; // Controla a velocidade de crescimento (quanto maior, mais rápido os obstáculos aceleram)

    // Calcular o fator de velocidade exponencial
    const fatorVelocidade = Math.pow(1.05, tempo); 

    // Atualiza a posição de cada obstáculo com a velocidade crescente
    for (let i = 0; i < obstaculos.length; i++) {
        obstaculos[i].velocidadex = velocidadeBase * fatorVelocidade;  // A velocidade dos obstáculos evolui exponencialmente
        obstaculos[i].x -= obstaculos[i].velocidadex;

        // Se o obstáculo saiu da tela, reinicia sua posição
        if (obstaculos[i].x <= 0 - obstaculos[i].largura) {
            obstaculos.splice(i, 1);  // Remove o obstáculo da tela
        }
    }
}

function desenharObstaculos() {
    for (let i = 0; i < obstaculos.length; i++) {
        ctx.drawImage(obstaculos[i].imagem2, obstaculos[i].x, obstaculos[i].y, obstaculos[i].largura, obstaculos[i].altura);
    }
}

function houveColisao() {
    personagem.velocidadey = 0;
    gameOver = true;  // Define o estado do jogo como "Game Over"
}

// Função para verificar colisão com triângulo
function verificarColisao() {
    for (let i = 0; i < obstaculos.length; i++) {
        const obstaculo = obstaculos[i];
        const trianguloVertices = [
            { x: obstaculo.x, y: obstaculo.y }, // Vértice superior
            { x: obstaculo.x + obstaculo.largura / 2, y: obstaculo.y + obstaculo.altura }, // Vértice inferior esquerdo
            { x: obstaculo.x + obstaculo.largura, y: obstaculo.y + obstaculo.altura }  // Vértice inferior direito
        ];

        // Verifica se o ponto (personagem) está dentro do triângulo
        if (isPointInTriangle(personagem.x + personagem.largura / 2, personagem.y + personagem.altura / 2, trianguloVertices)) {
            console.log("Houve colisão com o obstáculo", i);
            houveColisao();  // Ativa o game over quando ocorre uma colisão
        }
    }
}

// Função para verificar se o ponto (personagem) está dentro de um triângulo
function isPointInTriangle(px, py, tri) {
    const [v0, v1, v2] = tri;

    // Calculando as áreas dos triângulos formados com o ponto (px, py)
    const areaOrig = triangleArea(v0, v1, v2);
    const area1 = triangleArea({ x: px, y: py }, v1, v2);
    const area2 = triangleArea(v0, { x: px, y: py }, v2);
    const area3 = triangleArea(v0, v1, { x: px, y: py });

    // Se a soma das áreas menores for igual à área original, o ponto está dentro do triângulo
    return area1 + area2 + area3 === areaOrig;
}

// Função auxiliar para calcular a área de um triângulo dado seus vértices
function triangleArea(v0, v1, v2) {
    return Math.abs((v0.x * (v1.y - v2.y) + v1.x * (v2.y - v0.y) + v2.x * (v0.y - v1.y)) / 2);
}

// Função para desenhar a imagem de Game Over
// Função para desenhar a imagem de Game Over
function desenharGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
    
    // Calcular a posição central
    const gameOverWidth = gameOverImage.width;
    const gameOverHeight = gameOverImage.height;
    const centerX = (canvas.width - gameOverWidth) / 2;
    const centerY = (canvas.height - gameOverHeight) / 2;

    // Desenha a imagem de Game Over no centro da tela com seu tamanho original
    ctx.drawImage(gameOverImage, centerX, centerY, gameOverWidth, gameOverHeight);
}

// Loop principal do jogo
function loop() {
    // Se o jogo estiver em game over, desenha a tela de Game Over e não continua o jogo
    if (gameOver) {
        desenharGameOver();
        return;  // Para o loop, evitando que o jogo continue após o Game Over
    }

    // Limpa a tela toda do canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha o personagem novamente
    desenharPersonagem();

    // Atualiza as mudanças do personagem
    atualizarPersonagem();

    // Desenha os obstáculos
    desenharObstaculos();

    // Atualiza os obstáculos
    atualizarObstaculos();

    // Cria obstáculos apenas se houver menos de 3 obstáculos na tela
    if (obstaculos.length < 3) {
        if (Math.random() < 0.02) {
            criarObstaculo();
        }
    }

    verificarColisao();

    requestAnimationFrame(loop);
}

loop();
