var express = require('express')
var router = express.Router()
var multer = require('multer')

router.get('/', function(req, res, next) {
	res.json({ message: 'Get request received for /upload' })
})
const upload = multer({ dest: './uploads' })

router.post('/', upload.single('file'), function(req, res, next) {
	res.json({ file: req.file })
})

module.exports = router
