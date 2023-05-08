// app.js
const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const Todo = require('./models/todo')

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

app.get('/', (req, res) => {
    Todo.find() // 取出 Todo model 裡的所有資料
      .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
      .then(todos => res.render('index', { todos })) // 將資料傳給 index 樣板
      .catch(error => console.error(error)) // 錯誤處理
  })
app.listen(3000, () => {
    console.log('App is running on http://localhost:3000')
})