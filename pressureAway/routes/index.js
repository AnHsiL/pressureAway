var express = require('express');
var router = express.Router();

var myModules = require("../controller/controller");
myModules = new myModules();

router.post('/getAllData', myModules.getAllData);


module.exports = router;