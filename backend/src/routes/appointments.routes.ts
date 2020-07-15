import {Router, Request, Response} from 'express';
import {uuid} from 'uuidv4';
import {startOfHour, parseISO, isEqual} from 'date-fns';
import Appointment from '../models/Appointment';

const appointmentsRouter = Router();

const appointments: Appointment[] = [];

appointmentsRouter.post('/', (request: Request, response: Response) => {
  const {provider, date} = request.body;

  const parsedDate = startOfHour(parseISO(date));

  const isDateAlreadyBooked = appointments.find((appointment) =>
    isEqual(appointment.date, parsedDate),
  );

  if (isDateAlreadyBooked) {
    return response
      .status(400)
      .json({error: "There's already an appointment booked for this date"});
  }

  const appointment = new Appointment(provider, parsedDate);

  appointments.push(appointment);

  return response.status(200).json(appointment);
});

export default appointmentsRouter;
