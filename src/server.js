const express = require('express');
const nunjucks = require('nunjucks')

const server = express();

// configurar pasta publica
server.use(express.static('public'));

// utilizando template engine
nunjucks.configure('src/views', {
  express: server,
  noCache: true
})

server.use(express.json());

server.get('/', (request, response) => {
  response.render('index.html')
})

server.get('/create-point', (request, response) => {
  response.render('create-point.html')
})

server.get('/search', (request, response) => {
  response.render('search-results.html')
})


server.listen(3333, () => {
  console.log("🚀 Server started on port 3333!")
})