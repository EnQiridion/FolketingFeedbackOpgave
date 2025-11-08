const express = require('express');
const router = express.Router();
const controller = require('../controllers/personController');
const { validatePerson } = require('../validators/personValidator');

router.post('/persons', validatePerson, controller.createPerson);
router.get('/persons', controller.getAllPersons);
router.get('/persons/:id', controller.getPersonById);
router.put('/persons/:id', validatePerson, controller.updatePerson);
router.delete('/persons/:id', controller.deletePerson);

module.exports = router;