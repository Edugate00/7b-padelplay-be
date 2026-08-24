export interface CancelReservavtion {
  order_detail_id: number;
}

export interface CancelPayload extends CancelReservavtion {
  signature: string;
}

export interface CancelRowFromDB {
  order_item: string;
  order_id_ayo: number;
}
