// app.js
const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const Todo = require('./models/todo')
const bodyParser = require('body-parser')
// 載入 method-override
const methodOverride = require('method-override') 
// 設定每一筆請求都會透過 methodOverride 進行前置處理


// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    Todo.find() 
      .lean() 
      .sort({ _id: 'asc'})
      .then(todos => res.render('index', { todos })) 
      .catch(error => console.error(error)) 
  })

  app.get('/todos/new',(req, res) => {
    return res.render('new')
  })

  app.post('/todos',(req, res) => {
    const name =req.body.name

    return Todo.create({name})
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))

  })

  app.get('/todos/:id', (req, res) => {
    const id = req.params.id
    return Todo.findById(id)
      .lean()
      .then((todo) => res.render('detail', { todo }))
      .catch(error => console.log(error))
  })

  app.get('/todos/:id/edit', (req, res) => {
    const id = req.params.id
    return Todo.findById(id)
      .lean()
      .then((todo) => res.render('edit', { todo }))
      .catch(error => console.log(error))
  })

  app.put('/todos/:id', (req, res) => {
    const id = req.params.id
    const {name, isDone} = req.body
    return Todo.findById(id)
      .then(todo => {
        todo.name = name
        todo.isDone = isDone === "on"
        return todo.save()
      })
      .then(()=> res.redirect(`/todos/${id}`))
      .catch(error => console.log(error))
  })

  app.delete('/todos/:id', (req, res) => {
    const id = req.params.id
    return Todo.findById(id)
      .then(todo => todo.remove())
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
  })

  app.listen(3000, () => {
    console.log('App is running on http://localhost:3000')
})