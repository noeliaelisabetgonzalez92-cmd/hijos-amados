const eventService = require('../services/event.service');

const sendEvent = (res, event) => {
  if (!event) return res.status(404).json({ message: 'Evento no encontrado.' });
  return res.status(200).json({ data: event });
};

const createEvent = async (req, res, next) => {
  try {
    const event = await eventService.createEvent(req.body);
    return res.status(201).json({ data: event });
  } catch (error) {
    return next(error);
  }
};

const getEvents = async (req, res, next) => {
  try {
    const events = await eventService.loadEventsFromLocalExcel();
    return res.status(200).json({ data: events });
  } catch (error) {
    return next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    return sendEvent(res, event);
  } catch (error) {
    return next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const event = await eventService.updateEvent(req.params.id, req.body);
    return sendEvent(res, event);
  } catch (error) {
    return next(error);
  }
};

const updateAttendance = async (req, res, next) => {
  try {
    const event = await eventService.updateAttendance(req.params.id, req.body.isAssisted);
    return sendEvent(res, event);
  } catch (error) {
    return next(error);
  }
};

const updatePayment = async (req, res, next) => {
  try {
    const event = await eventService.updatePayment(req.params.id, req.body);
    return sendEvent(res, event);
  } catch (error) {
    return next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const event = await eventService.deleteEvent(req.params.id);
    if (!event) return res.status(404).json({ message: 'Evento no encontrado.' });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

const importEventsFromExcel = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Debe adjuntar un archivo Excel en el campo "file".' });
    }

    const events = await eventService.importEventsFromExcel(req.file.buffer);
    return res.status(201).json({
      message: 'Eventos importados correctamente.',
      count: events.length,
      data: events,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  updateAttendance,
  updatePayment,
  deleteEvent,
  importEventsFromExcel,
};