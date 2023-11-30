const errorDiv = document.querySelector('.erro');

// Adicionando o evento de click ao botão "Novo"
document.getElementById('btnNovo').addEventListener('click', function() {
    const formNovoVeiculo = document.getElementById('formNovoVeiculo');
    formNovoVeiculo.style.display = 'block';
});

// Adicionando o evento de click ao botão "Novo"
document.getElementById('btnNovo').addEventListener('click', function() {
  alternarFormulario();
});


// Variável para controlar o estado do formulário
let formularioVisivel = false;

// Função para alternar a exibição do formulário
function alternarFormulario() {
    const formNovoVeiculo = document.getElementById('formNovoVeiculo');
    if (formularioVisivel) {
        formNovoVeiculo.style.display = 'none';
        errorDiv.textContent = "";
    } else {
        formNovoVeiculo.style.display = 'block';

    }
    // Inverter o estado do formulário
    formularioVisivel = !formularioVisivel;
}



document.getElementById('novoVeiculoForm').addEventListener('submit', async function (event) {
  event.preventDefault(); // Evitar o envio tradicional do formulário

  const formData = new FormData(this);
  console.log('Dados do formulário:', Object.fromEntries(formData));

  try {
    const response = await fetch('/veiculos', {
      method: 'POST',
      credentials: 'same-origin', // Mantém as credenciais no mesmo domínio
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Object.fromEntries(formData)) // Envia os dados no formato JSON
    });

    const data = await response.json();

    if (data.error) {
      console.error(data.error);
      const errorMessage = data.error;
      errorDiv.textContent = errorMessage;
      errorDiv.style.display = 'block';
      // Trate o erro de acordo com sua lógica
    } else {
      console.log('Veículo adicionado com sucesso:', data);
      // Limpar os campos do formulário
      this.reset(); // Utiliza o método reset() no formulário para limpar os campos
    }
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
  }
});

const veiculoInput = document.getElementById('veiculoInput');
const anoInput = document.getElementById('anoInput');
const marcaInput = document.getElementById('marcaInput');

veiculoInput.addEventListener('input', realizarPesquisa);
anoInput.addEventListener('input', realizarPesquisa);
marcaInput.addEventListener('input', realizarPesquisa);

function realizarPesquisa() {
    const veiculo = veiculoInput.value;
    const ano = anoInput.value;
    const marca = marcaInput.value;

    const searchData = {
        veiculo,
        ano,
        marca
    };

    fetch('/search-veiculos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchData)
    })
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('#tableVeiculos tbody');
        tableBody.innerHTML = '';

        data.forEach(veiculo => {
            const newRow = tableBody.insertRow();
            const cell1 = newRow.insertCell(0);
            const cell2 = newRow.insertCell(1);
            const cell3 = newRow.insertCell(2);
            const cell4 = newRow.insertCell(3);
            const cell5 = newRow.insertCell(4);
            
            cell1.textContent = veiculo.id_veiculo ;
            cell2.textContent = veiculo.veiculo;
            cell3.textContent = veiculo.marca;
            cell4.textContent = veiculo.ano;
            cell5.textContent = veiculo.descricao;
            // Adicione outras colunas conforme necessário
        });
    })
    .catch(error => console.error('Erro ao buscar veículos:', error));
}








