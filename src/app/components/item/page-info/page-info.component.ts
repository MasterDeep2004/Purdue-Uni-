import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Main } from 'src/app/models/main.model';

@Component({
  selector: 'app-page-info',
  templateUrl: './page-info.component.html',
  styleUrls: ['./page-info.component.css']
})
export class PageInfoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PageInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Main
  ) {}

  ngOnInit(): void {
  }
}
