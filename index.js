const express = require('express')
const app = express()
const db = require('./server/dataBase')
// const server = require('./server')

// server(app)

app.listen(3000, function () {
    console.log('Example app listening on  http://127.0.0.1:3000!')
  });
app.get('/test', async (req, res) => {
  const result = await db.query('SELECT * FROM "public"."client_product"')
  console.log('result', result)
  res.send('hello world')
})
