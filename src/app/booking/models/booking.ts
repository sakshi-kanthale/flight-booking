export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PAYMENT_FAILED'
  | 'CANCELLED';

export interface PassengerInput {
  seatId: number;
  passengerName: string;
  passengerAge: number;
  passengerGender: Gender;
  passportNumber: string;
}

export interface CreateBookingRequest {
  userId: number;
  flightId: number;
  passengers: PassengerInput[];
}

export interface BookingPassenger {
  bookingPassengerId?: number;
  seatId: number;
  seatNumber?: string;
  passengerName: string;
  passengerAge: number;
  passengerGender: string;
  passportNumber: string;
}

export interface Booking {
  bookingId: number;
  userId: number;
  flightId: number;
  seatCount: number;
  bookingDate: string;
  status: BookingStatus;
  paymentId?: number;
  paymentAmount?: number;
  passengers: BookingPassenger[];
}