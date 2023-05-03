const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')

connectToMongo();
const app = express()
const port = 5011

app.use(cors())
app.use(express.json())

app.use(express.json())

//Avaialable Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

// app.get('/', (req, res) => {
//   res.send('Hello Shashank!')
// })

// app.get('/api/v1/login', (req, res) => {
//   res.send('Hello login!')
// })

// app.get('/api/v1/signup', (req, res) => {
//   res.send('Hello signup!')
// })

app.listen(port, () => {
  console.log(`iNoteBook app listening on port ${port}`)
})