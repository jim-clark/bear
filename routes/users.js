var express = require('express');
var router = express.Router();
const usersCtrl = require('../controllers/users');

router.get('/:userId/templates', usersCtrl.listTemplates);
router.post('/:userId/templates', usersCtrl.copyTemplates);

module.exports = router;
