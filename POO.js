class veiculo {
    constructor (tipo, marca, cor, velocidade, passageiros){
        this.tipo = tipo;
        this.marca = marca;
        this.cor = cor;
        this.velocidade = velocidade;
        this.passageiros = passageiros;
    }
    acelerar = function () {
        this.velocidade += 10
        console.log(this.velocidade)
    }
    freiar = function () {
        if (this.velocidade > 0){
            this.velocidade -=5
            console.log(this.velocidade)
        } else {
            console.log("Carro parado")
        }
    }
}

const carro = new veiculo(
    'suv',
    'chevrolet',
    'prata',
    0,
    0,
)

const carro2 = new veiculo("SUV", "Renault", "Cinza", 0, 0)
const carro3 = new veiculo ("Sedan", "Volkswagen", "vermelho", 0, 0)

console.log(carro)
carro.acelerar()
carro.freiar()

console.log(carro2)
carro.acelerar()
carro.freiar()
