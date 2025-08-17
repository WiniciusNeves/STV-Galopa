const express = require('express');
const router = express.Router();

// Importa todas as funções necessárias, incluindo a nova 'updatePlate'
const {
  getNames,
  getPlates,
  addName,
  addPlate,
  updateName,
  updatePlate,
  deleteName,
  deletePlate,
} = require('../controllers/namePlateController');

const { authenticate, isAdmin } = require('../middlewares/authMiddleware');


router.use(authenticate, isAdmin);

// --- Rotas para Nomes ---
router.get('/names', getNames);
router.post('/names', addName);
router.put('/names/:id', updateName);
router.delete('/names/:id', deleteName);

// --- Rotas para Placas ---
router.get('/plates', getPlates);
router.post('/plates', addPlate);
router.put('/plates/:id', updatePlate);
router.delete('/plates/:id', deletePlate);

module.exports = router;
