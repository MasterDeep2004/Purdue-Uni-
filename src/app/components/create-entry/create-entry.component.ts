import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { map, Observable, startWith } from 'rxjs';
import { EncyclopediaService } from 'src/app/services/encyclopedia.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Editor, Toolbar } from 'ngx-editor';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { HttpEventType } from '@angular/common/http';
import { Category } from 'src/app/models/category.model';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-create-entry',
  templateUrl: './create-entry.component.html',
  styleUrls: ['./create-entry.component.css'],
})
export class CreateEntryComponent implements OnInit {
  @ViewChild('uploadFileInput') uploadFileInput!: any;

  public Editor = ClassicEditor;
  public getScreenWidth: any;
  public getScreenHeight: any;
  displayedColumns: string[] = ['name', 'size', 'type', 'remove'];
  matDataSource!: MatTableDataSource<any>;
  submitButtonPressed: boolean = false;

  filteredOptions!: Observable<string[]> | undefined;
  editor!: Editor;
  mobileEditor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  mobileToolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  categories: Category[] = [];
  selectedCategories: Category[] = [];

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '300px',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    sanitize: true,
    toolbarPosition: 'bottom',
    toolbarHiddenButtons: [
      ['undo', 'redo'],
      ['link', 'unlink', 'insertImage', 'insertVideo', 'removeFormat'],
    ],
  };

  createEntryForm!: UntypedFormGroup;
  fileList: any[] = [];
  currentUser!: SocialUser;

  constructor(
    private fb: UntypedFormBuilder,
    private encyclopediaService: EncyclopediaService,
    private fileService: FileUploadService,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private authService: SocialAuthService,
  ) { }

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;

    this.authService.authState.subscribe((user) => {
      this.currentUser = user;
    });

    this.createEntryForm = this.fb.group({
      title: new UntypedFormControl('', [Validators.required]),
      richTextDescription: ['<br>Enter Page Content<br>'],
      category: new UntypedFormControl(),
      selectedCategoryColors: new UntypedFormArray([]),
    });

    this.editor = new Editor({
      keyboardShortcuts: true,
      inputRules: true,
      history: true,
    });

    this.mobileEditor = new Editor({
      history: true,
      keyboardShortcuts: true,
      inputRules: true,
    });

    this.encyclopediaService.getAllCategories().subscribe((data) => {
      this.categories = data;
    });

    this.filteredOptions = this.createEntryForm.controls[
      'category'
    ]?.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  onSubmit() {
    let entry: any = {
      title: this.createEntryForm.controls['title'].value,
      richDescription:
        this.createEntryForm.controls['richTextDescription'].value,
      category: this.selectedCategories,
    };

    entry.author = this.currentUser.email;

    this.encyclopediaService.createEntry(entry).subscribe(
      (data: string) => {
        if (data !== null && data !== undefined && data !== '') {
          if (this.fileList.length > 0) {
            this.submitButtonPressed = true;

            this.fileList.forEach((element) => {
              this.fileService
                .upload(data, '', element.file)
                .subscribe((event) => {
                  if (event.type === HttpEventType.UploadProgress) {
                    element.progress = Math.round(
                      (100 * event.loaded) /
                      (event.total == undefined ? 0 : event.total)
                    );
                  }

                  let flag = true;
                  this.fileList.forEach((element) => {
                    if (element.progress != 100) flag = false;
                  });

                  if (flag) {
                    this._snackBar.open(
                      'Created Page in Encyclopedia!',
                      'Dismiss',
                      {
                        duration: 3000,
                      }
                    );
                    if (event.type == HttpEventType.Response)
                      this._router.navigate([data]);
                  }
                });
            });
          } else {
            this._snackBar.open('Created Page in Encyclopedia!', 'Dismiss', {
              duration: 3000,
            });
            this._router.navigate([data]);
          }
        }
      },
      (error: any) =>
        this._snackBar.open('Error creating page!', 'Dismiss', {
          duration: 3000,
        })
    );
  }

  onCategoryOptionSelected(value: string) {
    if (value !== null && value !== undefined) {
      if (
        this.selectedCategories.find(
          (s: any) => s.name.toLowerCase() == value.toLowerCase()
        ) == undefined
      ) {
        this.selectedCategories.push({
          name: value,
          color:
            this.categories.find((s) => s.name == value)?.color == undefined
              ? this.getRandomColor()
              : (this.categories.find((s) => s.name == value)?.color as string),
        });
      } else
        this._snackBar.open('Category already added!', 'Dismiss', {
          duration: 3000,
        });

      this.createEntryForm.controls['category'].setValue('');
    }
  }
  addCategory() {
    let value = this.createEntryForm.controls['category'].value.trim();
    if (
      value !== 'no category' &&
      value !== '' &&
      value !== null &&
      value !== undefined &&
      /\S/.test(value)
    ) {
      if (
        this.selectedCategories.find(
          (s: any) => s.name.toLowerCase() == value.toLowerCase()
        ) == undefined
      ) {
        this.selectedCategories.push({
          name: value,
          color: this.getRandomColor(),
        });
      } else
        this._snackBar.open('Category already added!', 'Dismiss', {
          duration: 3000,
        });

      this.createEntryForm.controls['category'].setValue('');
    }
  }
  remove(value: any) {
    this.selectedCategories.forEach((element, index) => {
      if (element.name === value.name)
        this.selectedCategories.splice(index, 1);
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    let trunCategories: string[] = this.categories.map((s) => s.name);

    this.selectedCategories.forEach((element) => {
      trunCategories.forEach((cat, index) => {
        if (cat === element.name) trunCategories.splice(index, 1);
      });
    });

    return trunCategories.filter((option) =>
      option.toLowerCase().startsWith(filterValue)
    );
  }

  getRandomColor() {
    return (
      '#' +
      (
        '00000' + Math.floor(Math.random() * Math.pow(16, 6)).toString(16)
      ).slice(-6)
    );
  }

  handleFileInput(event: any) {
    if (
      this.checkFileType(event.currentTarget.value[0].name) &&
      this.checkFileSize(event.currentTarget.value[0].size)
    ) {
      if (
        this.fileList.findIndex(
          (s: any) => s.file.name == event.currentTarget.value[0].name
        ) == -1
      ) {
        this.fileList.push({
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
    let index = this.fileList.findIndex((s: any) => s.file.name == element);
    if (index != -1) {
      this.fileList.splice(index, 1);
      this.matDataSource = new MatTableDataSource<any>(this.fileList);
    }
  }
  getProgressValue(name: string) {
    let index = this.fileList.findIndex((s: any) => s.file.name == name);
    return this.fileList[index].progress;
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

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  onCategoryColorSelection(event: any, index: number) {
    this.selectedCategories[index].color = event.srcElement.value;
  }

  GetColor(option: string) {
    if (this.categories.find((s) => s.name == option) == undefined)
      return this.getRandomColor();
    else return this.categories.find((s) => s.name == option)?.color;
  }
}
