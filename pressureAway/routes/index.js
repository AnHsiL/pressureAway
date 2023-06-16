var express = require('express');
var router = express.Router();

var myModules = require("../controller/controller");
myModules = new myModules();

router.post('/setPersonalTask', myModules.setPersonalTask);
router.post('/getAllData', myModules.getAllData);
router.get('/getAllData', myModules.getAllData);


module.exports = router;