// Função para calcular a porcentagem de votos
function calcularPorcentagemVotos(votosOpcao, totalVotos) {
    return (votosOpcao / totalVotos) * 100;
}

// Número total de votos
const totalVotos = 1000; // Substitua pelo número total de votos

// Número de votos para cada opção
const validos = 800; // Substitua pelo número de votos para a opção A
const votosbrancos = 150; // Substitua pelo número de votos para a opção B
const nulos = 50; // Substitua pelo número de votos para a opção C

// Calculando a porcentagem de votos para cada opção
const porcentagemOpcaoA = calcularPorcentagemVotos(validos, totalVotos);
const porcentagemOpcaoB = calcularPorcentagemVotos(votosbrancos, totalVotos);
const porcentagemOpcaoC = calcularPorcentagemVotos(nulos, totalVotos);

// Exibindo os resultados
console.log(`Porcentagem de votos para a Opção A: ${porcentagemOpcaoA.toFixed(2)}%`);
console.log(`Porcentagem de votos para a Opção B: ${porcentagemOpcaoB.toFixed(2)}%`);
console.log(`Porcentagem de votos para a Opção C: ${porcentagemOpcaoC.toFixed(2)}%`);
