import { Component, HostListener, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
})
export class InfoComponent implements OnInit {
  suggestion = new UntypedFormControl('', [Validators.required]);
  isPFWUser: boolean = true;
  name = new UntypedFormControl('', [Validators.required]);
  email = new UntypedFormControl('', [Validators.required, Validators.email]);
  submitButtonPressed: boolean = false;
  public getScreenWidth: any;
  public getScreenHeight: any;

  constructor(
    private emailservice: EmailService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  sendEmail() {
    this.submitButtonPressed = true;
    this.emailservice
      .sendEmailNotPFW(
        this.suggestion.value,
        this.name.value,
        this.email.value
      )
      .subscribe(
        () => {
          this.submitButtonPressed = false;
          this.suggestion.setValue('');
          this.name.setValue('');
          this.email.setValue('');
          this._snackBar.open(
            'Your suggestion has been submitted!',
            'Dismiss',
            {
              duration: 3000,
            }
          );
        },
        (_error) => {
          this._snackBar.open('An error has occured!', 'Dismiss', {
            duration: 3000,
          });
        }
      );
  }

  onUserTypeSelection(event: any) {
    this.isPFWUser = event.value === 'Yes' ? true : false;
  }

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getNameErrorMessage() {
    return 'You must enter a value';
  }

  getSubmitButtonStatus() {
    if (this.isPFWUser) return !this.suggestion.valid;
    else return !this.name.valid || !this.email.valid || !this.suggestion.valid;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }
}
