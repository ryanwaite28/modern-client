import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from '../../services/alert.service';
import { ConnectionsService } from '../../services/connections.service';
import { SocketEventsService } from '../../services/socket-events.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'common-user-page-card',
  templateUrl: './user-page-card.component.html',
  styleUrls: ['./user-page-card.component.scss']
})
export class CommonUserPageCardComponent implements OnInit {
  @Input() you: any;
  @Input() user: any;

  get isYou(): boolean {
    const isYou = (
      this.you && 
      this.user &&
      this.user.id === this.you.id
    );
    return isYou;
  };
  get isNotYou(): boolean {
    const notYou = (
      this.you && 
      this.user &&
      this.user.id !== this.you.id
    );
    return notYou;
  };

  isShowingInfo = false;
  loading = false;
  isFollowing = false;
  isConnected = false;
  connectionRequest: any;
  messageFormIsOpen = false;
  MSG_MAX_LENGTH = 1000;
  messageForm = new FormGroup({
    body: new FormControl('', [
      Validators.required,
      // Validators.pattern(/(.*)+/),
      Validators.minLength(1),
      Validators.maxLength(this.MSG_MAX_LENGTH)
    ])
  });

  constructor(
    private userService: UsersService,
    private alertService: AlertService,
    private connectionsService: ConnectionsService,
    private socketEventsService: SocketEventsService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    
    if (this.isNotYou) {
      this.userService.check_user_follows(
        this.you.id,
        this.user.id
      ).subscribe({
        next: (response: any) => {
          console.log(response);
          this.isFollowing = !!response.data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChange) {
    this.messageFormIsOpen = false;
  }

  toggleFollow() {
    if (this.isFollowing) {
      this.userService.unfollow_user(
        this.you.id,
        this.user.id
      ).subscribe({
        next: (response: any) => {
          console.log(response);
          this.isFollowing = false;
        }
      });
    } else {
      this.userService.follow_user(
        this.you.id,
        this.user.id
      ).subscribe({
        next: (response: any) => {
          console.log(response);
          this.isFollowing = true;
        }
      });
    }
  }

  sendMessage() {
    if (this.loading) {
      return;
    }
    if (!this.messageForm.value.body.trim()) {
      return window.alert(`Message form cannot be empty`);
    }

    this.loading = true;
    this.userService.send_user_message(
      this.you.id,
      this.user.id,
      this.messageForm.value
    ).subscribe({
      next: (response: any) => {
        this.alertService.showSuccessMessage(response.message);
        this.messageForm.setValue({ body: '' });
        this.messageFormIsOpen = false;
        this.loading = false;
      }
    });
  }
}
