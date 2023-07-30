// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost', // Altere para o endereço do seu banco de dados
  user: 'root',
  password: 'root',
  database: 'tarefas',
});

module.exports = connection;
