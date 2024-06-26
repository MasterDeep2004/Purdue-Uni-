import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginDataService } from 'src/app/services/login-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public getScreenWidth: any;
  public getScreenHeight: any;

  constructor(private dataService: LoginDataService, private _router: Router) {}

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  onGetStartedClick() {
    this._router.navigate(['/search']);
  }
}
