import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FavorsService } from 'projects/myfavors/src/app/services/favors.service';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { AlertService } from 'projects/_common/src/app/services/alert.service';
import { UserService } from 'projects/_common/src/app/services/user.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';

@Component({
  selector: 'myfavors-favor-page',
  templateUrl: './favor-page.component.html',
  styleUrls: ['./favor-page.component.scss']
})
export class MyfavorsFavorPageComponent implements OnInit {
  you: IUser | any;
  favor: any = null;

  constructor(
    private userStore: UserStoreService,
    private userService: UserService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private favorsService: FavorsService
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe(you => {
      this.you = you;
    });
    
    this.route.data.subscribe((data) => {
      this.favor = data.favor;
      console.log(this);
    });
  }

  ngOnDestroy() {
  }

  onCurrentFavorCompleted() {
    
  }

  onCurrentFavorReturned() {
    
  }

  onDeleteFavor(favor: any) {
    this.favorsService.delete_favor(favor.id).subscribe({
      next: (response: any) => {
        this.alertService.handleResponseSuccessGeneric(response);
        this.router.navigate(['/', 'modern', 'apps', 'myfavors', 'users', this.you!.id, 'favors']);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
    });
  }
}
