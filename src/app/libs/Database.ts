import { Room, Message, User } from "./DB";

export interface Database {
    rooms: Room[];
    messages: Message[];
    users: User[];
  }