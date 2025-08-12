const express = require('express');
const router = express.Router();

const EmployeeController = require('../controller/employeeController');
const upload = require('../middleware/upload');
const authenticate = require('../middleware/authenticate');

router.get('/', authenticate, EmployeeController.index);
router.post('/show', EmployeeController.show);
router.post('/store', upload.single('avatar'), EmployeeController.store); // [ upload.array("avatar[]") ]
router.put('/update', EmployeeController.update);
router.delete('/delete', EmployeeController.destroy);

module.exports = router;
