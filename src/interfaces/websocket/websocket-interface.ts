export interface ClientMessageBase {
  type: string;
}

export interface JoinMessage extends ClientMessageBase {
  type: "GET";
  role: "display" | "controller";
  courtId: string;
}

export interface LeaveMessage extends ClientMessageBase {
  type: "leave";
  room: string;
}

export interface PublishMessage extends ClientMessageBase {
  type: "publish";
  room: string;
  payload?: unknown;
}

export interface BroadcastMessage extends ClientMessageBase {
  type: "broadcast";
  payload?: unknown;
}

export interface PingMessage extends ClientMessageBase {
  type: "ping";
}

export type ClientMessage =
  | JoinMessage
  | LeaveMessage
  | PublishMessage
  | BroadcastMessage
  | PingMessage;

export interface ServerMessageBase {
  type: string;
}

export interface WelcomeMessage extends ServerMessageBase {
  type: "welcome";
  id: string;
}

export interface JoinedMessage extends ServerMessageBase {
  type: "joined";
  room: string;
}

export interface LeftMessage extends ServerMessageBase {
  type: "left";
  room: string;
}

export interface RoomMessage extends ServerMessageBase {
  type: "message";
  room: string;
  from: string;
  payload: unknown;
}

export interface BroadcastOutMessage extends ServerMessageBase {
  type: "broadcast";
  from: string;
  payload: unknown;
}

export interface PongMessage extends ServerMessageBase {
  type: "pong";
}

export interface ErrorMessage extends ServerMessageBase {
  type: "error";
  message: string;
}

export type ServerMessage =
  | WelcomeMessage
  | JoinedMessage
  | LeftMessage
  | RoomMessage
  | BroadcastOutMessage
  | PongMessage
  | ErrorMessage;

export interface WSClient extends WebSocket {
  id?: string;
  isAlive?: boolean;
  rooms?: Set<string>;
}
