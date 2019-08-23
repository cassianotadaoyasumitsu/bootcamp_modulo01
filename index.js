// Install dependencies
const express = require("express");

// Variável
const server = express();

server.use(express.json()); // Passa para o express módulo para leitura do json

// req = dados da requisição
// Query params = ?teste1 (const nome = req.query.nome;)
// Route params = /users/1(id) (const { id } = req.params;)
// Request body = { "name": "Cassiano", "email": "@cassiano" }

// CRUD - Create, Read, Update, Delete

// Variável de vetor de usuários
const users = ["Cassiano", "Tadao", "Yasumitsu"];

// Middleware global, passa por todas as rotas
// Next deixa que o codigo continue executando
server.use((req, res, next) => {
  console.time("Request"); // Pega tempo inicial
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next(); // Parametro que passa para a proxima rota

  console.timeEnd("Request"); // Pega tempo final da requisição e calcula
});

// Middleware local
function checkUserExists(req, res, next) {
  // Se não encontrar
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is require!" });
  }

  return next();
}

// Middleware local
function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  // Se usuário não existe no array
  if (!user) {
    return res.status(400).json({ error: "User does not exists!" });
  }

  req.user = user;

  return next();
}

// Rota que retorna todos os usuários
server.get("/users", (req, res) => {
  return res.json(users);
});

// index = posição do array que retorna o usuário
// Rota que retorna um usuário
server.get("/users/:index", checkUserInArray, (req, res) => {
  return res.json(req.user); // res retorna resposta
});

// Rota que cria usuários
server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

// Rota que atualiza (update) usuários
server.put("/users/:index", checkUserInArray, checkUserExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

// Rota que deleta usuário
server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

// Escuta porta do servidor
server.listen(3000);
