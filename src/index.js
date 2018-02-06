const express = require('express')
const bodyParser = require('body-parser')

const fuelAgent = require('./fuelAgent.js')
const config = require('../config.json')

const app = express()
const fueler = new fuelAgent()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.get('/balance', (req, res) => {
  fueler.getBalance().then(sum => res.send(sum))
})

app.post('/request', (req, res) => {
  fueler.sendEther(req.body.address)
    .then(res.sendStatus(200))
})

app.listen(config.port, () => 
  console.log(`Service running on ${config.port}`)
)
