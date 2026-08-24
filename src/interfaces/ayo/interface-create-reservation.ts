export type BookingUser = Record<string, string>;

export interface BookingDetail {
  booking_id?: string;
  field_id: string;
  date: string;
  start_time: string;
  end_time: string;
  total_price: number;
  user: BookingUser;
}

export interface CreatePayload extends BookingDetail {
  signature: string;
}

export interface BookingRowCreate {
  booking_id: string;
  order_id: string;
  date: string;
  token: string;
  field_id: string;
  field_name: string;
  start_time: string;
  end_time: string;
  total_price: number;
  name: string;
  phone: string;
  email: string;
}
