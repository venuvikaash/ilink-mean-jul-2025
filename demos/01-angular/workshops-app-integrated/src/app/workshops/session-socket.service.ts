import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, fromEvent } from 'rxjs';

import ISession from './models/ISession';

@Injectable({
  providedIn: 'root'
})
export class SessionsSocket {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000', {
      auth: {
        token: `Bearer ${localStorage.getItem('auth-token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwiaWF0IjoxNzUyNDc1MTA0fQ.Gaod9LBwKAh_KrauhxWt9CvPavuwne4vmcdD5y28n5U'}`
      }
    });
  }

  onSessionUpdated(): Observable<ISession> {
    return fromEvent<ISession>(this.socket, 'sessionUpdated');
  }

  emitUpvote(sessionId: string): void {
    this.socket.emit('upvote', sessionId);
  }

  emitDownvote(sessionId: string): void {
    this.socket.emit('downvote', sessionId);
  }
}