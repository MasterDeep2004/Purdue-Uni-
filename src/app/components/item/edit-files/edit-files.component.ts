import { HttpEventType } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { elementAt } from 'rxjs';
import { Files } from 'src/app/models/files.model';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-edit-files',
  templateUrl: './edit-files.component.html',
  styleUrls: ['./edit-files.component.css'],
})
export class EditFilesComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<EditFilesComponent>,
    private _snackBar: MatSnackBar,
    private fileService: FileUploadService,
    @Inject(MAT_DIALOG_DATA) public entry: any
  ) {}

  matDataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['name', 'size', 'type', 'remove'];
  submitButtonPressed: boolean = false;
  uploadComplete: boolean = false;
  fileList: any[] = [];
  oldFileList: any[] = [];
  newFileList: any[] = [];
  removedFileList: any[] = [];

  ngOnInit(): void {
    this.entry.files.forEach((val: any) => {
      this.oldFileList.push(
        Object.assign(
          {
            mainId: '',
            fileName: '',
            fileType: '',
            fileSize: 0,
            progress: 0,
            progressShowFlag: false,
          },
          val
        )
      );

      this.fileList.push(
        Object.assign(
          {
            mainId: '',
            fileName: '',
            fileType: '',
            fileSize: 0,
            progress: 0,
            progressShowFlag: false,
          },
          val
        )
      );
    });
    this.matDataSource = new MatTableDataSource(this.fileList);
  }

  handleFileInput(event: any) {
    if (
      this.checkFileType(event.currentTarget.value[0].name) &&
      this.checkFileSize(event.currentTarget.value[0].size)
    ) {
      if (
        this.fileList.findIndex(
          (s: any) => s.fileName == event.currentTarget.value[0].name
        ) == -1
      ) {
        this.fileList.push({
          mainId: this.entry.id,
          fileName: event.currentTarget.value[0].name,
          fileSize: event.currentTarget.value[0].size,
          fileType: event.currentTarget.value[0].type,
          progress: 0,
        });
        this.newFileList.push({
          file: event.currentTarget.value[0],
          progress: 0,
        });
        this.matDataSource = new MatTableDataSource<any>(this.fileList);
      } else {
        this._snackBar.open('File already added!', 'Dismiss', {
          duration: 3000,
        });
      }
    } else {
      this._snackBar.open('Error adding file!', 'Dismiss', {
        duration: 3000,
      });
    }
  }

  onRemoveClick(element: string) {
    this.submitButtonPressed = true;
    let file: any = {};
    Object.assign(
      file,
      this.oldFileList.find((s: any) => s.fileName == element)
    );

    if (file.mainId != undefined) {
      this.fileService
        .deleteFile(file.mainId, file.fileName, file.id)
        .subscribe(() => {
          // do something
          this.submitButtonPressed = false;
        });
    }

    let index = this.fileList.findIndex((s: any) => s.fileName == element);
    if (index != -1) {
      this.fileList.splice(index, 1);
      this.matDataSource = new MatTableDataSource<any>(this.fileList);
    }

    let index2 = this.newFileList.findIndex((s: any) => s.file.name == element);
    if (index2 != -1) {
      this.newFileList.splice(index2, 1);
    }

    let index3 = this.oldFileList.findIndex((s: any) => s.fileName == element);
    if (index3 != -1) {
      this.oldFileList.splice(index3, 1);
    }

    this.submitButtonPressed = this.submitButtonPressed ? false : true;
  }

  getProgressValue(name: string) {
    let index = this.fileList.findIndex((s: any) => s.fileName == name);
    return this.fileList[index].progress;
  }

  onSubmitButtonClick() {
    if (this.newFileList.length > 0) {
      this.submitButtonPressed = true;
      this.newFileList.forEach((element, index) => {
        this.fileList.find(
          (s) => s.fileName == element.file.name
        ).progressShowFlag = true;

        this.fileService
          .upload(this.entry.id, '', element.file)
          .subscribe((event) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.fileList.find(
                (s) => s.fileName == element.file.name
              ).progress = Math.round(
                (100 * event.loaded) /
                  (event.total == undefined ? 0 : event.total)
              );
              element.progress = Math.round(
                (100 * event.loaded) /
                  (event.total == undefined ? 0 : event.total)
              );
            }

            let flag = true;
            this.newFileList.forEach((el) => {
              if (el.progress != 100) flag = false;
            });

            if (flag) {
              if (event.type == HttpEventType.Response)
                this.uploadComplete = true;
            }
          });
      });
    } else {
      this.dialogRef.close(this.getFileList());
    }
  }

  getFileList(): any[] {
    this.fileList.forEach((element, index) => {
      this.fileList[index].mainId = this.entry.id;
      this.fileList[index].progressShowFlag = false;
    });

    return this.fileList;
  }

  checkFileType(fileName: string): boolean {
    fileName = fileName.toLowerCase();

    if (
      fileName.endsWith('.pdf') ||
      fileName.endsWith('.txt') ||
      fileName.endsWith('.xlsx') ||
      fileName.endsWith('.csv') ||
      fileName.endsWith('.pptx') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.mp3') ||
      fileName.endsWith('.docx') ||
      fileName.endsWith('.doc') ||
      fileName.endsWith('.mkv') ||
      fileName.endsWith('.mov') ||
      fileName.endsWith('.flv') ||
      fileName.endsWith('.mp4') ||
      fileName.endsWith('.avi') ||
      fileName.endsWith('.webm') ||
      fileName.endsWith('.wmv')
    )
      return true;
    else return false;
  }

  checkFileSize(fileSize: number) {
    if (fileSize >= 25 * 1024 * 1024) {
      return false;
    } else return true;
  }
}
