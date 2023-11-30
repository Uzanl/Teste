function calcularFatorial(numero) {
    if (numero < 0) {
        return "O fatorial não pode ser calculado para números negativos.";
    } else if (numero === 0 || numero === 1) {
        return 1;
    } else {
        let resultado = 1;
        for (let i = 2; i <= numero; i++) {
            resultado *= i;
        }
        return resultado;
    }
}

// Exemplo de uso:
const numero = 5; // Altere o número aqui para calcular o fatorial desejado

const fatorial = calcularFatorial(numero);
console.log(`O fatorial de ${numero} é: ${fatorial}`);
