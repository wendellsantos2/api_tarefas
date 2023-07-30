// app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connection = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Endpoint para obter todas as tarefas
app.get('/tarefas', (req, res) => {
  connection.query('SELECT * FROM tarefas', (error, results) => {
    if (error) {
      console.error('Erro ao obter tarefas:', error);
      res.status(500).json({ error: 'Erro ao obter tarefas' });
    } else {
      res.json(results);
    }
  });
});

// Endpoint para adicionar uma nova tarefa
app.post('/tarefas', (req, res) => {
  const { texto, concluida } = req.body;
  connection.query(
    'INSERT INTO tarefas (texto, concluida) VALUES (?, ?)',
    [texto, concluida],
    (error, results) => {
      if (error) {
        console.error('Erro ao adicionar tarefa:', error);
        res.status(500).json({ error: 'Erro ao adicionar tarefa' });
      } else {
        res.json({ id: results.insertId, texto, concluida });
      }
    }
  );
});

app.put('/tarefas/:id', (req, res) => {
  const id = req.params.id;
  const { texto, concluida } = req.body;

  const camposAtualizar = {};

  // Verifica se o campo 'texto' está presente no corpo da requisição
  if (texto !== undefined) {
    camposAtualizar.texto = texto;
  }

  // Verifica se o campo 'concluida' está presente no corpo da requisição e é um valor booleano
  if (concluida !== undefined) {
    // Atualiza o campo 'concluida' apenas se for um valor booleano
    if (typeof concluida === 'boolean') {
      camposAtualizar.concluida = concluida;
    } else {
      return res.status(400).json({ error: 'O campo "concluida" deve ser um valor booleano (true ou false).' });
    }
  }

  connection.query(
    'UPDATE tarefas SET ? WHERE id = ?',
    [camposAtualizar, id],
    (error, results) => {
      if (error) {
        console.error('Erro ao atualizar tarefa:', error);
        res.status(500).json({ error: 'Erro ao atualizar tarefa' });
      } else {
        res.json({ id, ...camposAtualizar });
      }
    }
  );
});

 

// Endpoint para remover uma tarefa
app.delete('/tarefas/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM tarefas WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.error('Erro ao remover tarefa:', error);
      res.status(500).json({ error: 'Erro ao remover tarefa' });
    } else {
      res.json({ id });
    }
  });
});

// Inicialização do servidor
const port = 3000; // Altere a porta, se necessário
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
