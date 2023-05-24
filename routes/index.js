// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const todos = require('./modules/todos')
router.use('/', home)
router.use('/todos', todos)

// 匯出路由模組
module.exports = router