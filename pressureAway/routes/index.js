var express = require('express');
var router = express.Router();

var myModules = require("../controller/controller");
myModules = new myModules();

router.post('/setPersonalTask', myModules.setPersonalTask);
router.post('/getAllData', myModules.getAllData);
router.post('/getAllPressureData', myModules.getAllPressureData);
router.post('/getOriginalSched', myModules.getAllPressureData);
router.post('/getNewSched', myModules.getAllPressureData);


module.exports = router;