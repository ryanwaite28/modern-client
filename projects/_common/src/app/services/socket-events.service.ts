import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { UserStoreService } from '../stores/user-store.service';
import { Subscription, Subject, Observable } from 'rxjs';
import { IUser } from '../interfaces/user.interface';
import { ClientService } from './client.service';
import { ConversationsService } from './conversations.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UsersService } from './users.service';
import {
  user_notification_events
} from '../_misc/vault';
import { COMMON_EVENT_TYPES } from '../enums/all.enums';

@Injectable({
  providedIn: 'root'
})
export class SocketEventsService {
  private you: IUser | any;
  private socket: any;

  private connect_event: any;
  private reconnect_event: any;
  private socket_id_event: any;
  private user_event: any;
  private user_events: any[] = [];
  private disconnect_event: any;

  private previous_socket_id?: string;
  private current_socket_id?: string;

  private userStoreSubscription: Subscription;

  // event streams
  private streamsMap: { [key: string]: Subject<any>; } = {};

  // user's conversations
  private youConversationsSocketListeners: any = {};

  EVENT_TYPES = COMMON_EVENT_TYPES;

  constructor(
    private clientService: ClientService,
    private userStore: UserStoreService,
    private usersService: UsersService,
    private conversationsService: ConversationsService,
  ) {
    Object.keys(COMMON_EVENT_TYPES).forEach((key) => {
      this.streamsMap[key] = new Subject<any>();
    });
    console.log(this);

    this.userStoreSubscription = this.userStore.getChangesObs().subscribe((you) => {
      // if user logs in, `you` will have value (is null by default).
      // once user logs in, start listening to event for user
      if (!this.you && you) {
        this.you = you;
        console.log(`starting socket listener`);
        this.startListener();
      }

      // user logged out, 
      // stop listening to events
      if (this.you && !you) {
        this.you = null;
        console.log(`stopping socket listener`);
        this.stopListener();
      }
    });
  }

  private startListener() {
    const socket = io(this.clientService.DOMAIN);
    this.socket = socket;
    
    const connect_event = socket.on('connect', (event: any) => {
      this.current_socket_id = socket.id;
      console.log(`socket connected`, event, `socket id: ${socket.id}`, this);
      socket.emit(`SOCKET_TRACK`, { user_id: this.you!.id });
      
      if (this.previous_socket_id) {
        socket.emit(`SOCKET_UNTRACK`, { previous_socket_id: this.previous_socket_id });
      }
    });
    // const reconnect_event = socket.io.on('reconnect', (event: any) => {
    //   this.current_socket_id = socket.id;
    //   console.log(`socket reconnected`, event, this);
    //   socket.emit(`SOCKET_TRACK`, { user_id: this.you!.id });
    // });
    const disconnect_event = socket.on('disconnect', (event: any) => {
      this.previous_socket_id = this.current_socket_id;
      this.current_socket_id = undefined;
      console.log(`socket disconnected`, event, this);
    });
    const user_event = socket.on(`FOR-USER:${this.you!.id}`, (event: any) => {
      this.handleEvent(event);
    });
    
    const user_events = user_notification_events.map((event_type: COMMON_EVENT_TYPES) => {
      return socket.on(event_type, (event: any) => {
        console.log(`${event_type}`, { event });
        const subjectStream = this.streamsMap[event_type];
        if (!subjectStream) {
          throw new ReferenceError(`Could not emit event to stream: ${event_type}`);
        }
        subjectStream.next(event);
      });
    });
          
    // this.socket_id_event = socket_id_event;
    this.connect_event = connect_event;
    // this.reconnect_event = reconnect_event;
    this.user_event = user_event;
    this.user_events = user_events;
    this.disconnect_event = disconnect_event;
    
    this.listenToConversations();
  }
        
  private handleEvent(event: any) {
    console.log({ event });
    const subjectStream = this.streamsMap[event.event];
    if (subjectStream) {
      subjectStream.next(event);
    }
  }
  
  private stopListener() {
    this.connect_event?.disconnect();
    this.reconnect_event?.disconnect();
    this.socket_id_event?.disconnect();
    this.connect_event?.disconnect();
    this.user_event?.disconnect();
    this.user_events?.forEach(e => e.disconnect());
    this.disconnect_event?.disconnect();
    this.youConversationsSocketListeners = {};
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  joinRoom(room: string) {
    this.socket.emit(COMMON_EVENT_TYPES.SOCKET_JOIN_ROOM, { room });
  }

  leaveRoom(room: string) {
    this.socket.emit(COMMON_EVENT_TYPES.SOCKET_LEAVE_ROOM, { room });
  }

  listenToObservableEventStream<T>(event_type: COMMON_EVENT_TYPES) {
    const subjectStream = this.streamsMap[event_type];
    if (!subjectStream) {
      throw new ReferenceError(`Unknown key for event stream: ${event_type}`);
    }
    const observable = (<Observable<T>> subjectStream.asObservable());
    return observable;
  }

  listenSocketCustom(event_type: string, call_back: (arg?: any) => any) {
    return this.socket.on(event_type, call_back);
  }

  // private methods

  private listenToConversations(conversation_id?: number) {
    // add new listener
    if (conversation_id) {
      this.youConversationsSocketListeners[conversation_id] = this.listenSocketCustom(
        COMMON_EVENT_TYPES.NEW_CONVERSATION_MESSAGE,
        (event: any) => {
          this.streamsMap[COMMON_EVENT_TYPES.NEW_CONVERSATION_MESSAGE].next(event);
        }
      );
      return;
    }

    // get all user's conversations and listen
    this.conversationsService.get_user_conversations(
      this.you!.id,
      null,
      true
    ).subscribe({
      next: (response: any) => {
        for (const conversation of response.data) {
          this.joinRoom(`conversation-${conversation.id}`);
          
          this.youConversationsSocketListeners[conversation.id] = this.listenSocketCustom(
            COMMON_EVENT_TYPES.NEW_CONVERSATION_MESSAGE,
            (event: any) => {
              this.streamsMap[COMMON_EVENT_TYPES.NEW_CONVERSATION_MESSAGE].next(event);
            }
          );
        }
      },
      error: (error: HttpErrorResponse) => {
        // this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }
}
