const express = require('express');
const app = express();
const port = 3001;
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Sony#Xbox*1ç',
  database: 'carros',
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database!');
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/script', express.static(path.join(__dirname, 'script')));
app.use(bodyParser.json());


app.post('/veiculos', (req, res) => {
  const { veiculo, marca, ano, descricao, vendido } = req.body;
  const vendidoBooleano = (vendido === 'on');

  const missingFields = [];
  // Verificação de campos vazios
  if (!veiculo) {
    missingFields.push('Veículo');
  }

  if (!marca) {
    missingFields.push('Marca');
  }

  if (!ano) {
    missingFields.push('Ano');
  }

  if (!descricao) {
    missingFields.push('Descrição');
  }

  
  if (missingFields.length > 0) {
    const errorMessage = `Preencha: ${missingFields.join(', ')}`;
    return res.status(400).json({ error: errorMessage });
  }

  const sql = 'INSERT INTO veiculos SET veiculo = ?, marca = ?, ano = ?, descricao = ?, vendido = ?';
  const values = [veiculo, marca, ano, descricao, vendidoBooleano];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erro ao inserir veículo no banco de dados:', err);
      return res.status(500).json({ error: 'Erro ao inserir veículo no banco de dados' });
    }

    const novoVeiculo = {
      id: result.insertId,
      veiculo,
      marca,
      ano,
      descricao,
      vendido: vendidoBooleano
    };

    res.status(201).json(novoVeiculo);
  });
});

// Rota para pesquisa com filtros
app.post('/search-veiculos', (req, res) => {
  const { veiculo, ano, marca } = req.body;

  // Consulta no banco de dados utilizando LIKE nos campos desejados
  const sql = `SELECT * FROM veiculos WHERE veiculo LIKE ? AND ano LIKE ? AND marca LIKE ?`;
  const query = '%' + veiculo + '%';
  const queryAno = '%' + ano + '%';
  const queryMarca = '%' + marca + '%';

  connection.query(sql, [query, queryAno, queryMarca], (err, results) => {
      if (err) {
          console.error('Erro ao buscar veículos:', err);
          return res.status(500).json({ error: 'Erro ao buscar veículos' });
      }

      res.status(200).json(results);
  });
});






app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
