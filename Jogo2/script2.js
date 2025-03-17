const canvas = document.getElementById('jogo2d');
const ctx = canvas.getContext('2d');

document.addEventListener('keypress', (e) => {
    if (e.code === 'Space') {
        jogo.personagem.pular();
    }
});

document.addEventListener('click', () => {
    if (jogo.gameOver) {
        location.reload();
    }
});

const gravidade = 0.8;

// ---------------------- entidade -------------------------- //
class Entidade {
    constructor(x, y, largura, altura, imagemSrc) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
        this.imagem = new Image();
        this.imagem.src = imagemSrc;
    }

    desenhar(ctx) {
        ctx.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
    }
}

//-------------------- personagem -------------------------- //
class Personagem extends Entidade {
    constructor(x, y, largura, altura, imagemSrc) {
        super(x, y, largura, altura, imagemSrc);
        this.velocidadey = 0;
        this.pulando = false;
    }

    atualizar() {
        if (this.pulando) {
            this.velocidadey -= gravidade;
            this.y -= this.velocidadey;

            if (this.y >= canvas.height - this.altura - 93) {
                this.velocidadey = 0;
                this.pulando = false;
                this.y = canvas.height - this.altura - 93;
            }
        }
    }

    pular() {
        if (!this.pulando) {
            this.velocidadey = 15;
            this.pulando = true;
        }
    }
}

// --------------------- obstaculo ------------------------- //
class Obstaculo extends Entidade {
    constructor(x, y, largura, altura, imagemSrc) {
        super(x, y, largura, altura, imagemSrc);
        this.velocidadex = 7;
        this.passado = false; // Marca se o obstáculo foi "passado"
    }

    atualizar() {
        this.x -= this.velocidadex;

        if (this.x <= 0 - this.largura) {
            this.x = canvas.width + Math.random() * 200;
            this.passado = false; // Reseta o estado de "passado" quando o obstáculo é reposicionado
        }
    }
}

// ------------------------- jogo --------------------------- //
class Jogo {
    constructor() {
        this.personagem = new Personagem(100, canvas.height - 143, 50, 50, 'download.png');
        this.obstaculos = [];
        this.gameOverImage = new Image();
        this.gameOverImage.src = 'gameover.png';
        this.tempo = 0;
        this.pontuacao = 0;
        this.gameOver = false;
    }

    criarObstaculo() {
        const obstaculo = new Obstaculo(
            canvas.width + Math.random() * 200,
            canvas.height - 138,
            50,
            50,
            'https://i.redd.it/geometry-dash-spike-he-him-v0-xo3gm3moyo7d1.png?width=1280&format=png&auto=webp&s=a1f2e035e42acec99757c57d80aa17197ae22613'
        );
        this.obstaculos.push(obstaculo);
    }

    desenharPontuacao() {
        ctx.font = '30px Impact';
        ctx.fillStyle = 'white';
        ctx.fillText(`Pontuação: ${this.pontuacao}`, 10, 30);
    }

    desenharObstaculos() {
        for (let obstaculo of this.obstaculos) {
            obstaculo.desenhar(ctx);
        }
    }

    atualizarObstaculos() {
        for (let obstaculo of this.obstaculos) {
            obstaculo.atualizar();
        }
    }

    desenharPersonagem() {
        this.personagem.desenhar(ctx);
    }

    atualizarPersonagem() {
        this.personagem.atualizar();
    }

    verificarColisao() {
        for (let obstaculo of this.obstaculos) {
            if (this.personagem.x < obstaculo.x + obstaculo.largura &&
                this.personagem.x + this.personagem.largura > obstaculo.x &&
                this.personagem.y < obstaculo.y + obstaculo.altura &&
                this.personagem.y + this.personagem.altura > obstaculo.y) {
                this.gameOver = true;
                break;
            }
        }
    }

    desenharGameOver() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const gameOverWidth = this.gameOverImage.width;
        const gameOverHeight = this.gameOverImage.height;
        const centerX = (canvas.width - gameOverWidth) / 2;
        const centerY = (canvas.height - gameOverHeight) / 2;
        ctx.drawImage(this.gameOverImage, centerX, centerY, gameOverWidth, gameOverHeight);
    }

    atualizarPontuacao() {
        for (let obstaculo of this.obstaculos) {
            if (this.personagem.x + this.personagem.largura > obstaculo.x && !obstaculo.passado && obstaculo.x + obstaculo.largura < this.personagem.x) {
                obstaculo.passado = true;
                this.pontuacao++;  // Incrementa a pontuação quando o personagem passa o obstáculo
            }
        }
    }

    // -------------------- loop (dentro do jogo) --------------------- //
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
        this.atualizarPontuacao(); 

        if (this.obstaculos.length < 3 && Math.random() < 0.02) {
            this.criarObstaculo();
        }

        this.desenharPontuacao();

        requestAnimationFrame(() => this.loop());
    }
}

// Inicialização do jogo
const jogo = new Jogo();
jogo.loop();
