var express = require('express');
var router = express.Router();

var myModules = require("../controller/controller");
myModules = new myModules();

router.post('/setPersonalTask', myModules.setPersonalTask);
router.post('/getAllData', myModules.getAllData);
router.post('/getAllPressureData', myModules.getAllPressureData);
router.post('/toUnchangedStatus', myModules.toUnchangedStatus);
router.post('/toChangedStatus', myModules.toChangedStatus);
router.post('/getOriSched', myModules.getOriSched);
router.post('/getNewSched', myModules.getNewSched);
router.post('/setNewSched', myModules.setNewSched);

module.exports = router;