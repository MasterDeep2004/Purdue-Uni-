import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Admins } from 'src/app/models/admins.model';
import { AdminsService } from 'src/app/services/admins.service';
import { AddAdminPromptComponent } from './add-admin-prompt/add-admin-prompt.component';

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.css']
})
export class AdminManagementComponent implements OnInit {

  user!: SocialUser;

  constructor(private adminService: AdminsService, public dialog: MatDialog, private authService: SocialAuthService,
  ) { }

  dataSource!: Admins[];
  matDataSource!: MatTableDataSource<Admins>;
  displayedColumns: string[] = [
    'id',
    'usersid',
    'delete'
  ];

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.adminService.getall().subscribe((response) => {
        this.matDataSource = new MatTableDataSource<any>(response);
      });
    });
  }

  onDeleteButtonClick(userSid: string) {
    this.adminService.removeAdmin(userSid).subscribe(() => {
      this.ngOnInit();
    });
  }

  onAddAdminButtonClick() {
    this.dialog.open(AddAdminPromptComponent, {
    }).afterClosed().subscribe(() => {
      this.ngOnInit();
    });;
  }
}
