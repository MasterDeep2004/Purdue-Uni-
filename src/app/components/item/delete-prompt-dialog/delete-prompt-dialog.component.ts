import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-prompt-dialog',
  templateUrl: './delete-prompt-dialog.component.html',
  styleUrls: ['./delete-prompt-dialog.component.css'],
})
export class DeletePromptDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeletePromptDialogComponent>
  ) {}

  ngOnInit(): void {}

  onNoClick(){
    this.dialogRef.close(false);
  }

  onYesClick(){
    this.dialogRef.close(true);
  }
}
