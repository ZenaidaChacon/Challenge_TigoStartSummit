const express = require('express');
const router = express.Router();
const controller = require('../controllers/mockController');

router.post('/configure-mock', controller.createMock);
router.get('/configure-mock', controller.getMocks);
router.put('/configure-mock/:id', controller.updateMock);
router.delete('/configure-mock/:id', controller.deleteMock);

router.all('*', controller.executeMock);

module.exports = router;
