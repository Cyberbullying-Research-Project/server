// chat.controller.ts

import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ 
  cors: { origin: '*' }, 
  namespace: '/index' 
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;  

  afterInit(server: any) {
    console.log('Esto se ejecuta cuando inicia')
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('Hola alguien se conecto al socket 👌👌👌');
  }

  handleDisconnect(client: any) {
    console.log('ALguien se fue! chao chao')
  }
 
  @SubscribeMessage('events')
  handleEvent(client: Socket, payload: any){
    this.server.emit('events', payload);
  }
  
  @SubscribeMessage('event_join')
  handleJoinRoom(client: Socket, room: string) {
    client.join(`room_${room}`);
  }

  @SubscribeMessage('event_message') //TODO Backend
  handleIncommingMessage(
    client: Socket,
    payload: { room: string; message: string },
  ) {
    const { room, message } = payload;
    console.log(payload)
    this.server.to(`room_${room}`).emit('new_message',message);
  }

  @SubscribeMessage('event_leave')
  handleRoomLeave(client: Socket, room:string) {
    console.log(`chao room_${room}`)
    client.leave(`room_${room}`);
  }

  @SubscribeMessage('chatMessage')
  handleChatMessage(client: Socket, payload: any) {
    // Este método maneja el evento 'chatMessage' enviado desde el cliente
    console.log(`Mensaje recibido del cliente: ${payload}`);
    // Puedes emitir un mensaje de vuelta al cliente si es necesario
    this.server.emit('resChatMessage', `Servidor: ${payload}`);    
  }
}