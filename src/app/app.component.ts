import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { LoginDataService } from './services/login-data.service';
import { GoogleInitOptions, SocialAuthService } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { SocialUser } from '@abacritt/angularx-social-login';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminsService } from './services/admins.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  currentView = 'table';
  public getScreenWidth: any;
  public getScreenHeight: any;
  user!: SocialUser;
  loggedIn!: boolean;
  isLoggedInUserAdmin!: boolean;

  constructor(
    private dataService: LoginDataService,
    @Inject(DOCUMENT) private document: Document,
    private authService: SocialAuthService,
    private adminsService: AdminsService,
    private _snackBar: MatSnackBar,
    private _router: Router,
  ) { }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event: any) {
    this.dataService.setFlag(false);
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  ngOnInit() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    this.dataService.setView(this.currentView);

    this.authService.authState.subscribe((user) => {
      this.dataService.setCurrentUser(user);
      this.user = user;
      this.loggedIn = (user != null);

      if (this.loggedIn) {
        this.adminsService.isAdmin(user.email).subscribe((result) => {
          this.isLoggedInUserAdmin = result;
        });

        this._snackBar.open('Welcome ' + user.firstName + ' ' + user.lastName + '!', 'Dismiss', {
          duration: 3000,
        });
      }
      else {
        this.isLoggedInUserAdmin = false;
        this._router.navigate(['']);
      }
    });
  }

  goToUrl() {
    this.document.location.href = 'https://library.pfw.edu/';
  }

  onToggleView(value: string) {
    this.currentView = value;
    this.dataService.setView(value);
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut(true);
  }
}
