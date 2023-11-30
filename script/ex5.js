const errorDiv = document.querySelector('.erro');
const submitButton = document.getElementById('submitButton');

document.getElementById('btnNovo').addEventListener('click', function () {
  const formNovoVeiculo = document.getElementById('formNovoVeiculo');
  formNovoVeiculo.style.display = 'block';
  document.querySelector('.titulo-form').textContent = "Novo veículo";
  document.getElementById('novoVeiculoForm').reset();
  submitButton.textContent = 'Salvar';
  submitButton.setAttribute('data-type', 'insert');
  alternarFormulario();
});

let formularioVisivel = false;

function alternarFormulario() {
  const formNovoVeiculo = document.getElementById('formNovoVeiculo');
  if (formularioVisivel && submitButton.textContent !== "Atualizar") {
    errorDiv.textContent = "";
    document.getElementById('novoVeiculoForm').reset();
  } else {
    formNovoVeiculo.style.display = 'block';
    errorDiv.textContent = "";
    document.getElementById('novoVeiculoForm').reset();
  }
  formularioVisivel = !formularioVisivel;
}

// Função para realizar a inserção de um novo veículo
async function realizarInsercao(formData) {
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
      document.getElementById('novoVeiculoForm').reset(); // Utiliza o método reset() no formulário para limpar os campos
      carregarDados();
    }
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
  }
}

// Adicionando o evento de clique ao botão de submissão
document.getElementById('submitButton').addEventListener('click', function(event) {
  event.preventDefault(); // Evitar o envio tradicional do formulário
  const formData = new FormData(document.getElementById('novoVeiculoForm'));

  const submitButton = document.getElementById('submitButton');
  const operationType = submitButton.getAttribute('data-type');

  if (operationType === 'update') {
    const idVeiculo = submitButton.getAttribute('data-id-veiculo');
    realizarAtualizacao(idVeiculo); // USAR ID AQUIIIII
  } else {
    realizarInsercao(formData); // Função para realizar a inserção dos dados
  }

});

const veiculoInput = document.getElementById('veiculoInput');
const anoInput = document.getElementById('anoInput');
const marcaInput = document.getElementById('marcaInput');
const checkboxUltimaSemana = document.getElementById('ultimaSemana');

veiculoInput.addEventListener('input', realizarPesquisa);
anoInput.addEventListener('input', realizarPesquisa);
marcaInput.addEventListener('input', realizarPesquisa);
checkboxUltimaSemana.addEventListener('change', realizarPesquisa);


async function realizarPesquisa() {
  const veiculo = veiculoInput.value;
  const ano = anoInput.value;
  const marca = marcaInput.value;
  const ultimaSemana = checkboxUltimaSemana.checked; // Verifica se o checkbox está marcado

  const searchData = {
    veiculo,
    ano,
    marca,
    ultimaSemana // Inclui o estado do checkbox nos dados da pesquisa
  };

  try {
    const response = await fetch('/search-veiculos-like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(searchData)
    });

    const data = await response.json();
    const tableBody = document.querySelector('#tableVeiculos tbody');
    tableBody.innerHTML = '';

    data.forEach(veiculo => {
      const newRow = tableBody.insertRow();
      criarCelula(newRow, veiculo.id_veiculo);
      criarCelula(newRow, veiculo.veiculo);
      criarCelula(newRow, veiculo.marca);
      criarCelula(newRow, veiculo.ano);
      criarCelula(newRow, veiculo.descricao);
      criarCelula(newRow, veiculo.vendido ? "Sim" : "Não");
      criarCelula(newRow, veiculo.created);
      criarCelula(newRow, veiculo.updated);

      const cellAcoes = newRow.insertCell();
      newRow.setAttribute('data-id', veiculo.id_veiculo);

      const btnEditar = document.createElement('button');
      btnEditar.textContent = 'Editar';
      btnEditar.addEventListener('click', () => preencherCamposParaEdicao(veiculo.id_veiculo));
      cellAcoes.appendChild(btnEditar);

      const btnExcluir = document.createElement('button');
      btnExcluir.textContent = 'Excluir';
      btnExcluir.addEventListener('click', () => excluirVeiculo(veiculo.id_veiculo));
      cellAcoes.appendChild(btnExcluir);
    });
  } catch (error) {
    console.error('Erro ao buscar veículos:', error);
  }
}

async function buscarTodosVeiculos() {
  try {
    const response = await fetch('/search-veiculos');
    const data = await response.json();
    atualizarTabelaVeiculos(data); // Atualiza a tabela com os resultados da busca
  } catch (error) {
    console.error('Erro ao buscar veículos:', error);
  }
}

function criarCelula(row, content) {
  const cell = row.insertCell();
  cell.textContent = content;
  return cell;
}

// Função para atualizar a tabela de veículos na interface do usuário
function atualizarTabelaVeiculos(veiculos) {
  const tableBody = document.getElementById('tableVeiculos').getElementsByTagName('tbody')[0];
  tableBody.innerHTML = ''; // Limpar conteúdo atual da tabela

  veiculos.forEach(veiculo => {
    const newRow = tableBody.insertRow();
    criarCelula(newRow, veiculo.id_veiculo);
    criarCelula(newRow, veiculo.veiculo);
    criarCelula(newRow, veiculo.marca);
    criarCelula(newRow, veiculo.ano);
    criarCelula(newRow, veiculo.descricao);
    criarCelula(newRow, veiculo.vendido ? "Sim" : "Não");
    criarCelula(newRow, veiculo.created);
    criarCelula(newRow, veiculo.updated);

    const cellAcoes = newRow.insertCell();
    newRow.setAttribute('data-id', veiculo.id_veiculo);

    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.addEventListener('click', () => preencherCamposParaEdicao(veiculo.id_veiculo));
    cellAcoes.appendChild(btnEditar);

    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'Excluir';
    btnExcluir.addEventListener('click', () => excluirVeiculo(veiculo.id_veiculo));
    cellAcoes.appendChild(btnExcluir);
  });
}

async function excluirVeiculo(idVeiculo) {
  try {
    const response = await fetch(`/delete-veiculo/${idVeiculo}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    // Se a exclusão for bem-sucedida, atualize a tabela de veículos
    (data.success)? carregarDados():console.error('Erro ao excluir veículo');
  } catch (error) {
    console.error('Erro ao excluir veículo:', error);
  }
}

// Função para preencher os campos do formulário com os dados para edição
function preencherCamposParaEdicao(idVeiculo) {
  // Obter a linha associada ao botão clicado
  const linha = document.querySelector(`tr[data-id="${idVeiculo}"]`);
  // Obter os dados da linha clicada
 
  const veiculo = linha.cells[1].textContent;
  const marca = linha.cells[2].textContent;
  const ano = linha.cells[3].textContent;
  const descricao = linha.cells[4].textContent;
  const vendido = linha.cells[5].textContent;

  // Preencher os campos do formulário com os dados obtidos
  document.getElementById('veiculoformInput').value = veiculo;
  document.getElementById('marcaformInput').value = marca;
  document.getElementById('anoformInput').value = ano;
  document.getElementById('descricaoformInput').value = descricao;
  // Marcar a checkbox 'Vendido' se o valor for "Sim"
  document.getElementById('vendidoformInput').checked = (vendido.toLowerCase() === 'sim');
  // Exibir o formulário de edição
  document.getElementById('formNovoVeiculo').style.display = 'block';
  document.querySelector('.titulo-form').textContent= "Atualizar";
   // Modifique o comportamento do botão de envio do formulário para indicar uma atualização
   submitButton.textContent = 'Atualizar'; // Altere o texto do botão
   submitButton.setAttribute('data-type', 'update');
   submitButton.setAttribute('data-id-veiculo', idVeiculo);
}

async function realizarAtualizacao(idVeiculo) {
  try {
    const form = document.getElementById('novoVeiculoForm');
    const formData = new FormData(form);

    const response = await fetch(`/update-veiculo/${idVeiculo}`, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Object.fromEntries(formData))
    });

    const data = await response.json();

    if (data.error) {
      console.error(data.error);
      const errorMessage = data.error;
      errorDiv.textContent = errorMessage;
      errorDiv.style.display = 'block';
    } else {
      console.log('Veículo atualizado com sucesso:', data);
      form.reset();
      carregarDados();
    }
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
  }
}

// Função assíncrona para buscar e preencher a tabela com a contagem de veículos por ano
async function preencherTabelaContagemPorAno() {
  try {
    const response = await fetch('/count-veiculos-por-ano');
    const data = await response.json();
    const tableBody = document.getElementById('tableBodyCount');
    // Limpar o conteúdo atual da tabela
    tableBody.innerHTML = '';
    // Preencher a tabela com os resultados da contagem por ano
    data.forEach(veiculoPorAno => {
      const newRow = tableBody.insertRow();
      const cellAno = newRow.insertCell(0);
      const cellQuantidade = newRow.insertCell(1);

      cellAno.textContent = veiculoPorAno.ano;
      cellQuantidade.textContent = veiculoPorAno.quantidade;
    });
  } catch (error) {
    console.error('Erro ao buscar contagem de veículos por ano:', error);
  }
}

// Função assíncrona para buscar e preencher a tabela com a contagem de veículos por ano com filtro LIKE
async function preencherTabelaContagemPorAnoFiltrado(filtroAno) {
  try {
    const response = await fetch(`/count-veiculos-por-ano-like?ano=${filtroAno}`);
    const data = await response.json();
    const tableBody = document.getElementById('tableBodyCount');

    // Limpar o conteúdo atual da tabela
    tableBody.innerHTML = '';

    // Preencher a tabela com os resultados da contagem por ano com filtro LIKE
    data.forEach(veiculoPorAno => {
      const newRow = tableBody.insertRow();
      const cellAno = newRow.insertCell(0);
      const cellQuantidade = newRow.insertCell(1);

      cellAno.textContent = veiculoPorAno.ano;
      cellQuantidade.textContent = veiculoPorAno.quantidade;
    });
  } catch (error) {
    console.error('Erro ao buscar contagem de veículos por ano com filtro LIKE:', error);
  }
}

// Capturar evento de mudança de texto do input de filtro de ano
const inputFiltroAno = document.getElementById('anoInput'); // Substitua pelo seu ID de input
inputFiltroAno.addEventListener('input', async function(event) {
  const filtroAno = event.target.value; // Obter o valor do input
  // Chamar a função para preencher a tabela com filtro LIKE
  await preencherTabelaContagemPorAnoFiltrado(filtroAno);
});

// Função para preencher a tabela com a contagem de veículos por marca
function preencherTabelaContagemPorMarca(data) {
  const tableBody = document.getElementById('tableBodyCountMarca');

  tableBody.innerHTML = '';
  // Itera sobre os dados recebidos e preenche a tabela
  data.forEach(item => {
    const newRow = tableBody.insertRow();
    const cellMarca = newRow.insertCell(0);
    const cellQuantidade = newRow.insertCell(1);

    cellMarca.textContent = item.marca;
    cellQuantidade.textContent = item.quantidade;
  });
}

// Função para buscar a contagem de veículos por marca usando async/await
async function buscarContagemVeiculosPorMarca() {
  try {
    const response = await fetch('/count-veiculos-por-marca');
    const data = await response.json();
    preencherTabelaContagemPorMarca(data);
  } catch (error) {
    console.error('Erro ao buscar contagem de veículos por marca:', error);
  }
}

// Função assíncrona para buscar e preencher a tabela com a contagem de veículos por ano com filtro LIKE
async function preencherTabelaContagemPorMarcaFiltrado(filtroMarca) {
  try {
    const response = await fetch(`/count-veiculos-por-marca-like?marca=${filtroMarca}`);
    const data = await response.json();
    const tableBody = document.getElementById('tableBodyCountMarca');
    // Limpar o conteúdo atual da tabela
    tableBody.innerHTML = '';
    // Preencher a tabela com os resultados da contagem por ano com filtro LIKE
    data.forEach(veiculoPorMarca => {
      const newRow = tableBody.insertRow();
      const cellMarca = newRow.insertCell(0);
      const cellQuantidade = newRow.insertCell(1);

      cellMarca.textContent = veiculoPorMarca.marca;
      cellQuantidade.textContent = veiculoPorMarca.quantidade;
    });
  } catch (error) {
    console.error('Erro ao buscar contagem de veículos por ano com filtro LIKE:', error);
  }
}

// Capturar evento de mudança de texto do input de filtro de ano
const inputFiltroMarca = document.getElementById('marcaInput'); // Substitua pelo seu ID de input
inputFiltroMarca.addEventListener('input', async function(event) {
  const filtroMarca = event.target.value; // Obter o valor do input
  // Chamar a função para preencher a tabela com filtro LIKE
  await preencherTabelaContagemPorMarcaFiltrado(filtroMarca);
});

// Função para buscar o total de veículos não vendidos
async function buscarTotalNaoVendidos() {
  try {
    const response = await fetch('/count-nao-vendidos');
    const data = await response.json();
    // Manipular os dados recebidos e preencher a div
    const totalNaoVendidosSpan = document.getElementById('totalNaoVendidos');
    totalNaoVendidosSpan.textContent = `Total de veículos não vendidos: ${data.total}`;
  } catch (error) {
    console.error('Erro ao buscar total de veículos não vendidos:', error);
    // Lógica para tratamento de erros, se necessário
  }
}
// Definição da função para carregar os dados
async function carregarDados() {
  try {
    await buscarContagemVeiculosPorMarca();
    await buscarTodosVeiculos();
    await preencherTabelaContagemPorAno();
    await buscarTotalNaoVendidos();
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
}
// Chamada da função para carregar os dados
carregarDados();











