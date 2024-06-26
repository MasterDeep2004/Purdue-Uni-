import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Admins } from 'src/app/models/admins.model';
import { AdminsService } from 'src/app/services/admins.service';

@Component({
  selector: 'app-add-admin-prompt',
  templateUrl: './add-admin-prompt.component.html',
  styleUrls: ['./add-admin-prompt.component.css']
})
export class AddAdminPromptComponent implements OnInit {

  email!: string;
  user!: SocialUser;

  constructor(
    public dialogRef: MatDialogRef<AddAdminPromptComponent>,
    private adminService: AdminsService,
    private authService: SocialAuthService,
    private _snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // this.authService.authState.subscribe((user) => {
    //   this.user = user;
    // });
  }

  onAddButtonClick() {
    // if (this.user) {
    this.adminService.addAdmin(this.email).subscribe(() => {
      this.dialogRef.close();
    },(error)=>{
      this._snackbar.open('Email Alreay Exists!', 'Dismiss', {duration: 3000})
    });
    // }
  }
}
