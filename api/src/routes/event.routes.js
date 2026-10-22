const express = require('express');
const multer = require('multer');
const eventController = require('../controllers/event.controller');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});

const requireBody = (req, res, next) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ message: 'El cuerpo de la solicitud debe ser un objeto JSON.' });
  }
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'El cuerpo de la solicitud no puede estar vacío.' });
  }
  return next();
};

// Ruta GET que consulta el frontend (lee el Excel local del escritorio)
router.get('/', eventController.getEvents);

// Rutas de creación, actualización e importación
router.post('/', requireBody, eventController.createEvent);
router.post('/import/excel', upload.single('file'), eventController.importEventsFromExcel);
router.get('/:id', eventController.getEventById);
router.put('/:id', requireBody, eventController.updateEvent);
router.patch('/:id', requireBody, eventController.updateEvent);
router.patch('/:id/attendance', requireBody, eventController.updateAttendance);
router.patch('/:id/payment', requireBody, eventController.updatePayment);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;