const express = require('express');
const nunjucks = require('nunjucks')

// Pegar o banco de dados
const db = require('./database/db');

const server = express();

// configurar pasta publica
server.use(express.static('public'));

// utilizando template engine
nunjucks.configure('src/views', {
  express: server,
  noCache: true
})

server.use(express.json());
server.use(express.urlencoded({extended: true}))

server.get('/', (request, response) => {
  response.render('index.html')
})

server.get('/create-point', (request, response) => {
  //console.log(request.query);
  response.render('create-point.html')
})

server.post('/savepoint', (request, response) => {
  const data = request.body;

  const query = `
    INSERT INTO places (
      image,
      name, 
      address, 
      address2, 
      state, 
      city, 
      items
    ) VALUES (?,?,?,?,?,?,?);
  `

  const values = [
    data.image,
    data.name,
    data.address,
    data.address2,
    data.state,
    data.city,
    data.items
  ]

  function afterInsertData(err) {
    if(err) {
      console.log(err);
      return response.render('create-point.html', {error: true})
    }

    console.log('Cadastrado com sucesso');
    console.log(this)
    return response.render('create-point.html', {saved: true})

  }

   db.run(query, values, afterInsertData)
})

server.get('/search', (request, response) => {
  const search = request.query.search;

  if (search == '') {
    
    return response.render('search-results.html', { total: 0 })
  }

  // pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`,  function(err, rows) {
    if (err) {
      return console.log(err);
    }

    const total = rows.length;

    return response.render('search-results.html', { places: rows, total })
  })
})


server.listen(3000, () => {
  console.log("🚀 Server started on port 3000!")
})