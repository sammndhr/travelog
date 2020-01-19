var express = require('express')
var router = express.Router()
var multer = require('multer')
const db = require('../models/psql.config')
const { createImageExif } = db
router.get('/', function(req, res, next) {
	res.json({ message: 'Get request received for /upload' })
})

// router.post('/', function(req, res, next) {
// 	console.log(req.body)
// 	res.json({ message: 'Recieved post req' })
// })

router.post('/', createImageExif)

// const upload = multer({ dest: './uploads' })

// router.post('/', upload.single('file'), function(req, res, next) {
// 	res.json({ file: req.file })
// })

module.exports = router
