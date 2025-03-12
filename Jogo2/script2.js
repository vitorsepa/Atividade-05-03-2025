// pegando o canvas do html
const canvas = document.getElementById('jogo2d');
const ctx = canvas.getContext('2d');

document.addEventListener('keypress', (e) => {
    if (e.code === 'Space') {
        jogo.personagem.pular();
    }
});

document.addEventListener('click' || 'Space', () => {
    if (jogo.gameOver) {
        location.reload();  // Recarrega o jogo
    }
});

// Definindo algumas constantes globais
const gravidade = 0.8;
let gameOver = false;

// Classe Entidade (base para personagens e obstáculos)
class Entidade {
    constructor(x, y, largura, altura, imagemSrc) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
        this.imagem = new Image();
        this.imagem.src = imagemSrc;
    }

    // Método para desenhar a imagem no canvas
    desenhar(ctx) {
        ctx.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
    }
}

// Classe Personagem
class Personagem extends Entidade {
    constructor(x, y, largura, altura, imagemSrc) {
        super(x, y, largura, altura, imagemSrc);
        this.velocidadey = 0;
        this.pulando = false;
    }

    // Atualizar a posição do personagem
    atualizar() {
        if (this.pulando) {
            this.velocidadey -= gravidade;
            this.y -= this.velocidadey;

            // Conceito de chão (evitar que o personagem fique abaixo do chão)
            if (this.y >= canvas.height - this.altura - 93) {
                this.velocidadey = 0;
                this.pulando = false;
                this.y = canvas.height - this.altura - 93;
            }
        }
    }

    // Método para fazer o personagem pular
    pular() {
        if (!this.pulando) {
            this.velocidadey = 15;
            this.pulando = true;
        }
    }
}

// Classe Obstaculo
class Obstaculo extends Entidade {
    constructor(x, y, largura, altura, imagemSrc) {
        super(x, y, largura, altura, imagemSrc);
        this.velocidadex = 7;  // Velocidade inicial
    }

    // Atualizar a posição do obstáculo
    atualizar() {
        this.x -= this.velocidadex;

        // Se o obstáculo saiu da tela, reinicia sua posição
        if (this.x <= 0 - this.largura) {
            this.x = canvas.width + Math.random() * 200; // Posição nova
        }
    }
}

// Classe Jogo
class Jogo {
    constructor() {
        this.personagem = new Personagem(100, canvas.height - 143, 50, 50, 'download.png');
        this.obstaculos = [];
        this.gameOverImage = new Image();
        this.gameOverImage.src = 'gameover.png';
        this.tempo = 0;
    }

    // Função para criar obstáculos
    criarObstaculo() {
        const obstaculo = new Obstaculo(
            canvas.width + Math.random() * 200, // Posição inicial aleatória
            canvas.height - 138,
            50,
            50,
            'https://i.redd.it/geometry-dash-spike-he-him-v0-xo3gm3moyo7d1.png?width=1280&format=png&auto=webp&s=a1f2e035e42acec99757c57d80aa17197ae22613'
        );
        this.obstaculos.push(obstaculo);
    }

    // Função para desenhar obstáculos
    desenharObstaculos() {
        for (let obstaculo of this.obstaculos) {
            obstaculo.desenhar(ctx);
        }
    }

    // Função para atualizar obstáculos
    atualizarObstaculos() {
        for (let obstaculo of this.obstaculos) {
            obstaculo.atualizar();
        }
    }

    // Função para desenhar o personagem
    desenharPersonagem() {
        this.personagem.desenhar(ctx);
    }

    // Função para atualizar o personagem
    atualizarPersonagem() {
        this.personagem.atualizar();
    }

    // Função para verificar colisão
    verificarColisao() {
        for (let obstaculo of this.obstaculos) {
            // Verificação simples de colisão por caixas delimitadoras
            if (this.personagem.x < obstaculo.x + obstaculo.largura &&
                this.personagem.x + this.personagem.largura > obstaculo.x &&
                this.personagem.y < obstaculo.y + obstaculo.altura &&
                this.personagem.y + this.personagem.altura > obstaculo.y) {
                this.gameOver = true;  // Ativa o game over
                break;
            }
        }
    }

    // Função para desenhar o Game Over
    desenharGameOver() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
        const gameOverWidth = this.gameOverImage.width;
        const gameOverHeight = this.gameOverImage.height;
        const centerX = (canvas.width - gameOverWidth) / 2;
        const centerY = (canvas.height - gameOverHeight) / 2;
        ctx.drawImage(this.gameOverImage, centerX, centerY, gameOverWidth, gameOverHeight);
    }

    // Loop principal do jogo
    loop() {
        if (this.gameOver) {
            this.desenharGameOver();
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.desenharPersonagem();
        this.atualizarPersonagem();
        this.desenharObstaculos();
        this.atualizarObstaculos();
        this.verificarColisao();

        // Cria obstáculos a cada loop
        if (this.obstaculos.length < 3 && Math.random() < 0.02) {
            this.criarObstaculo();
        }

        requestAnimationFrame(() => this.loop());
    }
}

// Instanciando o jogo
const jogo = new Jogo();

// Inicia o loop do jogo
jogo.loop();
