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


app.post('/insert-veiculos', (req, res) => {
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

// Rota para obter todos os veículos
app.get('/search-veiculos', (req, res) => {
  // Consulta SQL para selecionar todos os veículos e formatar as datas
  const sql = `
    SELECT *,
    DATE_FORMAT(created, '%d/%m/%Y %H:%i') as created,
    DATE_FORMAT(updated, '%d/%m/%Y %H:%i') as updated
    FROM veiculos
  `;

  // Executar a consulta no banco de dados MySQL
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao buscar veículos:', err);
      return res.status(500).json({ error: 'Erro ao buscar veículos' });
    }

    // Retornar os resultados da consulta com as datas formatadas
    res.status(200).json(results);
  });
});


// Rota para pesquisa com filtros
app.post('/search-veiculos-like', (req, res) => {
  const { veiculo, ano, marca, ultimaSemana } = req.body;

  let sql = `
    SELECT *,
    DATE_FORMAT(created, '%d/%m/%Y %H:%i') as created,
    DATE_FORMAT(updated, '%d/%m/%Y %H:%i') as updated
    FROM veiculos
    WHERE veiculo LIKE ? AND ano LIKE ? AND marca LIKE ?
  `;

  const queryVeiculo = '%' + veiculo + '%';
  const queryAno = '%' + ano + '%';
  const queryMarca = '%' + marca + '%';

  // Adiciona condição para buscar os registros da última semana se a opção estiver marcada
  if (ultimaSemana) {
    console.log("chegou aqui")
    sql += ' AND created >= DATE_SUB(NOW(), INTERVAL 1 WEEK)';
  }

  connection.query(sql, [queryVeiculo, queryAno, queryMarca], (err, results) => {
    if (err) {
      console.error('Erro ao buscar veículos:', err);
      return res.status(500).json({ error: 'Erro ao buscar veículos' });
    }

    res.status(200).json(results);
  });
});


// Rota para excluir um veículo pelo ID
app.delete('/delete-veiculo/:id', (req, res) => {
  const idVeiculo = req.params.id;

  // Consulta SQL para excluir o veículo com o ID correspondente
  const sql = 'DELETE FROM veiculos WHERE id_veiculo = ?';

  // Executar a consulta no banco de dados MySQL
  connection.query(sql, [idVeiculo], (err, result) => {
    if (err) {
      console.error('Erro ao excluir veículo:', err);
      return res.status(500).json({ error: 'Erro ao excluir veículo' });
    }

    if (result.affectedRows > 0) {
      // Se ao menos uma linha for afetada, significa que a exclusão foi bem-sucedida
      res.status(200).json({ success: true });
    } else {
      // Caso contrário, o veículo com o ID especificado não foi encontrado para exclusão
      res.status(404).json({ success: false, error: 'Veículo não encontrado para exclusão' });
    }
  });
});
// Rota para atualizar um veículo por ID
app.put('/update-veiculo/:idVeiculo', (req, res) => {
  const idVeiculo = req.params.idVeiculo;
  let updatedData = req.body; // Dados atualizados do veículo

  const missingFields = [];
  // Verificação de campos vazios
  if (!updatedData.veiculo) {
    missingFields.push('Veículo');
  }

  if (!updatedData.marca) {
    missingFields.push('Marca');
  }

  if (!updatedData.ano) {
    missingFields.push('Ano');
  }

  if (!updatedData.descricao) {
    missingFields.push('Descrição');
  }

  
  if (missingFields.length > 0) {
    const errorMessage = `Preencha: ${missingFields.join(', ')}`;
    return res.status(400).json({ error: errorMessage });
  }
  

  (updatedData.vendido === "on")? updatedData.vendido = 1: updatedData.vendido = 0;

  // Utilização de um prepared statement para atualizar o veículo de forma segura
  connection.query(
    'UPDATE veiculos SET ? WHERE id_veiculo = ?',
    [updatedData, idVeiculo],
    (err, results) => {
      if (err) {
        console.error('Erro ao atualizar veículo:', err);
        return res.status(500).json({ error: 'Erro ao atualizar veículo' });
      }

      // Verifica se houve sucesso na atualização
      if (results.affectedRows > 0) {
        res.status(200).json({ success: true, message: 'Veículo atualizado com sucesso' });
      } else {
        res.status(404).json({ success: false, error: 'Veículo não encontrado' });
      }
    }
  );
});

app.get('/count-veiculos-por-ano', (req, res) => {
  // Consulta SQL para contar a quantidade de veículos agrupados por ano
  const sql = `SELECT ano, COUNT(*) AS quantidade FROM veiculos GROUP BY ano`;

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao contar veículos por ano:', err);
      return res.status(500).json({ error: 'Erro ao contar veículos por ano' });
    }

    // Retornar a contagem de veículos agrupados por ano
    res.status(200).json(results);
  });
});

// Rota para contagem de veículos por ano com filtro LIKE
app.get('/count-veiculos-por-ano-like', (req, res) => {
  const { ano } = req.query;

  // Utilização de um prepared statement para realizar a contagem com filtro LIKE
  connection.query(
    'SELECT ano, COUNT(*) AS quantidade FROM veiculos WHERE ano LIKE ? GROUP BY ano',
    [`%${ano}%`],
    (err, results) => {
      if (err) {
        console.error('Erro ao contar veículos por ano com filtro LIKE:', err);
        return res.status(500).json({ error: 'Erro ao contar veículos por ano com filtro LIKE' });
      }

      res.status(200).json(results);
    }
  );
});

// Rota para obter a contagem de veículos por marca
app.get('/count-veiculos-por-marca', (req, res) => {
  // Consulta SQL para contar veículos por marca
  const sql = 'SELECT marca, COUNT(*) AS quantidade FROM veiculos GROUP BY marca';

  // Executar a consulta no banco de dados MySQL
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao contar veículos por marca:', err);
      return res.status(500).json({ error: 'Erro ao contar veículos por marca' });
    }

    // Retornar os resultados da contagem por marca como resposta
    res.status(200).json(results);
  });
});


// Rota para contagem de veículos por marca usando filtro LIKE
app.get('/count-veiculos-por-marca-like', (req, res) => {
  const searchTerm = req.query.marca; // Obtém o parâmetro de consulta "marca" do cliente

  // Execute a consulta SQL para contar veículos por marca com filtro LIKE
  connection.query(
    'SELECT marca, COUNT(*) AS quantidade FROM veiculos WHERE marca LIKE ? GROUP BY marca',
    [`%${searchTerm}%`],
    (err, results) => {
      if (err) {
        console.error('Erro ao contar veículos por marca:', err);
        return res.status(500).json({ error: 'Erro ao contar veículos por marca' });
      }

      // Enviar os resultados da contagem como resposta
      res.status(200).json(results);
    }
  );
});

// Rota para obter a contagem de veículos não vendidos
app.get('/count-nao-vendidos', (req, res) => {
  // Consulta SQL para contar os veículos não vendidos
  const sql = `
    SELECT COUNT(*) AS total
    FROM veiculos
    WHERE vendido = 0
  `;

  // Executar a consulta no banco de dados MySQL
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao contar veículos não vendidos:', err);
      return res.status(500).json({ error: 'Erro ao contar veículos não vendidos' });
    }

    // Retornar o total de veículos não vendidos
    res.status(200).json(results[0]); // Os resultados estarão na primeira posição do array
  });
});




app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
