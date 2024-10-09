import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Client } from 'pg';

@WebSocketGateway({ cors: { origin: process.env.FE_URL, credentials: true } })
@Injectable()
export class UserNotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer() server: Server;
  private pgClient: Client;

  async onModuleInit() {
    // Initialize the PostgreSQL client
    console.log('onModuleInit called...');
    this.pgClient = new Client({
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      port: process.env.PGPORT,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      ssl: {
        rejectUnauthorized: false, // If using self-signed certificates, set this to false
      },
    });

    // Handle successful connection
    this.pgClient.on('connect', () => {
      console.log('Connected to PostgreSQL database successfully.');
    });
    // Handle connection errors
    this.pgClient.on('error', (err) => {
      console.error('Failed to connect to PostgreSQL database:', err);
    });

    try {
      
      await this.pgClient.connect(); // Attempt to connect to the database

      // Listen for PostgreSQL NOTIFY events on the specified channel
      await this.pgClient.query('LISTEN new_notification_channel');

      // Handle incoming notifications
      this.pgClient.on('notification', (msg) => {
        const payload = JSON.parse(msg.payload);
        console.log('Broadcasting notification for missed status...', payload);

        // Broadcast the notification to WebSocket clients
        this.server.emit('notification', payload);
      });
    } catch (error) {
      console.error('Error during database connection:', error);
    }
  }

  handleConnection(client: Socket) {
    console.log('Client connected...', client.id);
    
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected...', client.id);
  }
}
