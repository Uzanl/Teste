function somaMultiplosDe3ou5(x) {
    let soma = 0;

    for (let i = 1; i < x; i++) {
        if (i % 3 === 0 || i % 5 === 0) {
            soma += i;
        }
    }

    return soma;
}

// Exemplo de uso:
const numeroLimite = 10; // Altere o número aqui para o valor desejado

const resultado = somaMultiplosDe3ou5(numeroLimite);
console.log(`A soma dos múltiplos de 3 ou 5 até ${numeroLimite} é: ${resultado}`);
