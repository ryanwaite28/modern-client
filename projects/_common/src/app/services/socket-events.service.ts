import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { UserStoreService } from '../stores/user-store.service';
import { Subscription, Subject, Observable } from 'rxjs';
import { IUser } from '../interfaces/user.interface';
import { EVENT_TYPES } from '../enums/all.enums';
import { ClientService } from './client.service';
import { ConversationsService } from './conversations.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SocketEventsService {
  private you: IUser | null = null;
  private socket: any;

  private connect: any;
  private event: any;
  private disconnect: any;

  private userStoreSubscription: Subscription;

  // event streams
  private streamsMap: { [key: string]: Subject<any>; } = {};

  // user's conversations
  private youConversationsSocketListeners: any = {};

  EVENT_TYPES = EVENT_TYPES;

  constructor(
    private clientService: ClientService,
    private userStore: UserStoreService,
    private userService: UserService,
    private conversationsService: ConversationsService,
  ) {
    Object.keys(EVENT_TYPES).forEach((key) => {
      this.streamsMap[key] = new Subject<any>();
    });

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
    
    const connect = socket.on('connect', (event: any) => {
      console.log(`socket connected`, event);
    });
    const disconnect = socket.on('disconnect', (event: any) => {
      console.log(`socket disconnected`, event);
    });

    const event = socket.on(`FOR-USER:${this.you!.id}`, (event: any) => {
      this.handleEvent(event);
    });
    

    this.socket = socket;
    this.connect = connect;
    this.event = event;
    this.disconnect = disconnect;

    this.listenToConversations();
  }

  private stopListener() {
    this.connect.disconnect();
    this.event.disconnect();
    this.disconnect.disconnect();
    this.youConversationsSocketListeners = {};
  }

  private handleEvent(event: any) {
    const subjectStream = this.streamsMap[event.event_type];
    if (subjectStream) {
      subjectStream.next(event);
    }
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  listen<T>(event_type: EVENT_TYPES) {
    const subjectStream = this.streamsMap[event_type];
    if (!subjectStream) {
      throw new ReferenceError(`Unknown key for event stream: ${event_type}`);
    }
    const observable = (<Observable<T>> subjectStream.asObservable());
    return observable;
  }

  listenCustom(event_type: string, call_back: (arg?: any) => any) {
    return this.socket.on(event_type, call_back);
  }

  // private methods

  private listenToConversations(conversation_id?: number) {
    // add new listener
    if (conversation_id) {
      this.youConversationsSocketListeners[conversation_id] = this.listenCustom(
        `${EVENT_TYPES.NEW_CONVERSATION_MESSAGE}:conversation-${conversation_id}`,
        (event: any) => {
          this.streamsMap[EVENT_TYPES.NEW_CONVERSATION_MESSAGE].next(event);
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
      next: (response) => {
        for (const conversation of response.data) {
          this.youConversationsSocketListeners[conversation.id] = this.listenCustom(
            `${EVENT_TYPES.NEW_CONVERSATION_MESSAGE}:conversation-${conversation.id}`,
            (event: any) => {
              this.streamsMap[EVENT_TYPES.NEW_CONVERSATION_MESSAGE].next(event);
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