var express = require('express');
var router = express.Router();

var myModules = require("../controller/controller");
myModules = new myModules();

// router.post('/getData', myModules.register);


module.exports = router;