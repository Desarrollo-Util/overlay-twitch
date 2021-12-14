import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export type SocketClient = Socket<DefaultEventsMap, DefaultEventsMap>;
