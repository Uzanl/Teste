const errorDiv = document.querySelector('.erro');

// Adicionando o evento de click ao botão "Novo"
document.getElementById('btnNovo').addEventListener('click', function () {
  const formNovoVeiculo = document.getElementById('formNovoVeiculo');
  formNovoVeiculo.style.display = 'block';
});

// Adicionando o evento de click ao botão "Novo"
document.getElementById('btnNovo').addEventListener('click', function () {
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
    const response = await fetch('/insert-veiculos', {
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
      buscarTodosVeiculos();
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

  fetch('/search-veiculos-like', {
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
        const cell6 = newRow.insertCell(5);
        const cell7 = newRow.insertCell(6);
        const cell8 = newRow.insertCell(7);

        cell1.textContent = veiculo.id_veiculo;
        cell2.textContent = veiculo.veiculo;
        cell3.textContent = veiculo.marca;
        cell4.textContent = veiculo.ano;
        cell5.textContent = veiculo.descricao;
        cell6.textContent = veiculo.vendido ? "Sim" : "Não";
        cell7.textContent = veiculo.created;
        cell8.textContent = veiculo.updated;

         // Botões de ação: Editar e Excluir
    const cellAcoes = newRow.insertCell(-1);

    // Botão de edição
    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.addEventListener('click', () => editarVeiculo(veiculo.id_veiculo)); // Chama a função para editar o veículo
    cellAcoes.appendChild(btnEditar);

    // Botão de exclusão (já definido anteriormente)
    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'Excluir';
    btnExcluir.addEventListener('click', () => excluirVeiculo(veiculo.id_veiculo)); // Chama a função para excluir o veículo
    cellAcoes.appendChild(btnExcluir);
        // Adicione outras colunas conforme necessário
      });
    })
    .catch(error => console.error('Erro ao buscar veículos:', error));
}

// Função para buscar todos os veículos
function buscarTodosVeiculos() {
  fetch('/search-veiculos')
    .then(response => response.json())
    .then(data => {
      atualizarTabelaVeiculos(data); // Atualiza a tabela com os resultados da busca
    })
    .catch(error => console.error('Erro ao buscar veículos:', error));
}

// Função para atualizar a tabela de veículos na interface do usuário
function atualizarTabelaVeiculos(veiculos) {
  const tableBody = document.getElementById('tableVeiculos').getElementsByTagName('tbody')[0];
  tableBody.innerHTML = ''; // Limpar conteúdo atual da tabela

  // Iterar sobre os veículos e preencher a tabela
  veiculos.forEach(veiculo => {
    const newRow = tableBody.insertRow();
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);
    const cell5 = newRow.insertCell(4);
    const cell6 = newRow.insertCell(5);
    const cell7 = newRow.insertCell(6);
    const cell8 = newRow.insertCell(7);

    cell1.textContent = veiculo.id_veiculo;
    cell2.textContent = veiculo.veiculo;
    cell3.textContent = veiculo.marca;
    cell4.textContent = veiculo.ano;
    cell5.textContent = veiculo.descricao;
    cell6.textContent = veiculo.vendido ? "Sim" : "Não";
    cell7.textContent = veiculo.created;
    cell8.textContent = veiculo.updated;

     // Botões de ação: Editar e Excluir
     const cellAcoes = newRow.insertCell(-1);

     // Botão de edição
     const btnEditar = document.createElement('button');
     btnEditar.textContent = 'Editar';
     btnEditar.addEventListener('click', () => editarVeiculo(veiculo.id_veiculo)); // Chama a função para editar o veículo
     cellAcoes.appendChild(btnEditar);
 
     // Botão de exclusão (já definido anteriormente)
     const btnExcluir = document.createElement('button');
     btnExcluir.textContent = 'Excluir';
     btnExcluir.addEventListener('click', () => excluirVeiculo(veiculo.id_veiculo)); // Chama a função para excluir o veículo
     cellAcoes.appendChild(btnExcluir);
    // Preencher outras células da tabela conforme necessário
  });
}

// Evento para buscar todos os veículos ao carregar a página
document.addEventListener('DOMContentLoaded', buscarTodosVeiculos);



async function excluirVeiculo(idVeiculo) {
  try {
    const response = await fetch(`/delete-veiculo/${idVeiculo}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    // Se a exclusão for bem-sucedida, atualize a tabela de veículos
    if (data.success) {
      buscarTodosVeiculos(); // Recarrega os veículos na tabela após a exclusão
    } else {
      console.error('Erro ao excluir veículo');
      // Lógica para tratamento de erro, se necessário
    }
  } catch (error) {
    console.error('Erro ao excluir veículo:', error);
  }
}






