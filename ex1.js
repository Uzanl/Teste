class CalculadoraVotos {
    constructor(totalVotos, votosValidos, votosBrancos, votosNulos) {
        this.totalVotos = totalVotos;
        this.votosValidos = votosValidos;
        this.votosBrancos = votosBrancos;
        this.votosNulos = votosNulos;
    }

    calcularPorcentagemVotos(votos) {
        return (votos / this.totalVotos) * 100;
    }

    exibirPorcentagemVotos() {
        const porcentagemValidos = this.calcularPorcentagemVotos(this.votosValidos);
        const porcentagemBrancos = this.calcularPorcentagemVotos(this.votosBrancos);
        const porcentagemNulos = this.calcularPorcentagemVotos(this.votosNulos);

        console.log(`Porcentagem de votos para Válidos: ${porcentagemValidos.toFixed(2)}%`);
        console.log(`Porcentagem de votos para Brancos: ${porcentagemBrancos.toFixed(2)}%`);
        console.log(`Porcentagem de votos para Nulos: ${porcentagemNulos.toFixed(2)}%`);
    }
}

// Utilização da classe CalculadoraVotos
const calculadora = new CalculadoraVotos(1000, 800, 150, 50);
calculadora.exibirPorcentagemVotos();
