import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EncyclopediaService } from 'src/app/services/encyclopedia.service';
import { LoginDataService } from 'src/app/services/login-data.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login-landing',
  templateUrl: './login-landing.component.html',
  styleUrls: ['./login-landing.component.css'],
})
export class LoginLandingComponent implements OnInit {
  constructor(
    private encyclopediaService: EncyclopediaService,
    private dataService: LoginDataService,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private authService: SocialAuthService
  ) { }

  user!: SocialUser;
  loggedIn!: boolean;

  ngOnInit(): void {
  }
}
