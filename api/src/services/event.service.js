const fs = require('fs');
const path = require('path');
const Event = require('../models/Event');
const { parseEventsFromExcel } = require('../utils/eventExcel.util');

const PAYMENT_METHODS = ['efectivo', 'transferencia'];

const requestError = (ErrorType, message) => Object.assign(new ErrorType(message), { status: 400 });

const validatePayment = ({ totalPayment, paidAmount, methodPayment }) => {
  if (!Number.isFinite(totalPayment) || totalPayment < 0) {
    throw requestError(TypeError, 'El total debe ser un número mayor o igual a cero.');
  }
  if (!Number.isFinite(paidAmount) || paidAmount < 0 || paidAmount > totalPayment) {
    throw requestError(RangeError, 'El monto abonado debe estar entre cero y el total.');
  }
  if (!PAYMENT_METHODS.includes(methodPayment)) {
    throw requestError(TypeError, 'El método de pago debe ser efectivo o transferencia.');
  }
};

const createEvent = async (eventData) => {
  const event = new Event({ ...eventData, paidAmount: eventData.paidAmount ?? 0 });
  validatePayment(event);
  await event.validate();
  return event.save();
};

const getEvents = async (filter = {}) => Event.find(filter);

const getEventById = async (eventId) => Event.findById(eventId);

const updateEvent = async (eventId, updates) => {
  const allowedFields = ['nameAndLastName', 'isAssisted', 'methodPayment', 'totalPayment', 'paidAmount'];
  const changes = Object.fromEntries(
    Object.entries(updates).filter(([field]) => allowedFields.includes(field)),
  );

  const existingEvent = await Event.findById(eventId);
  if (!existingEvent) return null;

  const nextEvent = { ...existingEvent.toObject(), ...changes };
  validatePayment(nextEvent);

  return Event.findByIdAndUpdate(eventId, changes, { new: true, runValidators: true });
};

const updateAttendance = async (eventId, isAssisted) => {
  if (typeof isAssisted !== 'boolean') {
    throw requestError(TypeError, 'El estado de presencia debe ser booleano.');
  }
  return Event.findByIdAndUpdate(eventId, { isAssisted }, { new: true, runValidators: true });
};

const updatePayment = async (eventId, { paidAmount, methodPayment } = {}) => {
  const event = await Event.findById(eventId);
  if (!event) return null;

  const nextPayment = {
    totalPayment: event.totalPayment,
    paidAmount: paidAmount ?? event.paidAmount,
    methodPayment: methodPayment ?? event.methodPayment,
  };
  validatePayment(nextPayment);

  const updates = { paidAmount: nextPayment.paidAmount };
  if (methodPayment !== undefined) updates.methodPayment = nextPayment.methodPayment;

  return Event.findByIdAndUpdate(eventId, updates, { new: true, runValidators: true });
};

const deleteEvent = async (eventId) => Event.findByIdAndDelete(eventId);

const importEventsFromExcel = async (fileBuffer) => {
  const events = await parseEventsFromExcel(fileBuffer);
  for (const [index, event] of events.entries()) {
    try {
      await new Event(event).validate();
    } catch (error) {
      if (error.name !== 'ValidationError') throw error;
      throw requestError(
        Error,
        `Datos inválidos en la fila ${event.rowNumber ?? index + 1}: ${error.message}`,
      );
    }
  }
  return Event.insertMany(
    events.map(({ rowNumber, ...event }) => event),
    { ordered: true },
  );
};

// Carga directa del Excel sin interactuar con MongoDB
const loadEventsFromLocalExcel = async () => {
  let filePath = path.join(__dirname, '../../CONGRESO VPM.xlsx');
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, '../CONGRESO VPM.xlsx');
  }
  if (!fs.existsSync(filePath)) {
    filePath = 'C:\\Users\\Usuario\\Desktop\\CONGRESO VPM\\CONGRESO VPM.xlsx';
  }

  if (!fs.existsSync(filePath)) {
    throw requestError(Error, `No se encontró el archivo Excel en la ruta: ${filePath}`);
  }

  const fileBuffer = fs.readFileSync(filePath);
  
  // Procesa el Excel directamente sin invocar Mongoose (insertMany)
  const events = await parseEventsFromExcel(fileBuffer);

  // Mapeamos un identificador virtual _id para React
  return events.map((event, index) => ({
    _id: `excel-${event.rowNumber || index + 1}`,
    ...event,
  }));
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
  loadEventsFromLocalExcel,
};