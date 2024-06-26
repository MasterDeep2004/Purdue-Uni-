import {
  Component,
  HostListener,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Location } from '@angular/common';
import { Main } from 'src/app/models/main.model';
import { EncyclopediaService } from 'src/app/services/encyclopedia.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditTitleComponent } from './edit-title/edit-title.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Editor, Toolbar } from 'ngx-editor';
import { UntypedFormBuilder } from '@angular/forms';
import { CategoryDataService } from 'src/app/services/category-data.service';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { DeletePromptDialogComponent } from './delete-prompt-dialog/delete-prompt-dialog.component';
import { LoginDataService } from 'src/app/services/login-data.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { Files } from 'src/app/models/files.model';
import * as saveAs from 'file-saver';
import { EditFilesComponent } from './edit-files/edit-files.component';
import { MatTableDataSource } from '@angular/material/table';
import { PreviewFileComponent } from './preview-file/preview-file.component';
import { CommentsService } from 'src/app/services/comments.service';
import { Comments } from 'src/app/models/comments.model';
import { PageInfoComponent } from './page-info/page-info.component';
import {
  RelatedPage,
  RelatedPageCollection,
} from 'src/app/models/related-pages.model';
import { ExternalPage } from 'src/app/models/external-page.model';
import { SocialUser } from '@abacritt/angularx-social-login';
import { AdminsService } from 'src/app/services/admins.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ItemComponent implements OnInit {
  recommendedSectionIsLoaded = false;
  externalSectionIsLoaded = false;
  relatedPages: RelatedPageCollection[] = [];
  externalPages: ExternalPage[] = [];
  externalPageCardIndex = 0;
  externalSectionNavigateRightButtonDisabled = false;
  externalSectionLoadError = false;
  comments: any[] = [];
  comment: string = '';
  mapCommentEditToggle: Map<string, boolean> = new Map<string, boolean>();
  commentLikedMap: Map<string, string> = new Map<string, string>();
  commentEditMap: Map<string, string> = new Map<string, string>();
  isPageLoading: boolean = true;
  public getScreenWidth: any;
  public getScreenHeight: any;
  showEditButtons: boolean = false;
  displayedColumns: string[] = ['name', 'size', 'type', 'download'];
  encyclopediaItem: Main = {
    title: '',
    id: '',
    richDescription: '',
    rawDescription: '',
    category: [],
    files: [],
    links: [],
    author: '',
    createdDate: new Date(),
    lastUpdatedOn: new Date(),
  };
  editor!: Editor;
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

  form = this.fb.group({
    data: [''],
  });

  editDescriptionFlag: boolean = false;
  matTableSource!: MatTableDataSource<Files>;
  currentUser!: SocialUser;
  currentUserIsAdmin!: boolean;

  constructor(
    private encyclopediaService: EncyclopediaService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private categoryDataService: CategoryDataService,
    private _router: Router,
    private location: Location,
    private dataService: LoginDataService,
    private fileService: FileUploadService,
    private commentsService: CommentsService,
    private adminsService: AdminsService,
  ) { }

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    this.editor = new Editor({
      keyboardShortcuts: true,
    });
    this.dataService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      if (this.currentUser)
        this.adminsService.isAdmin(this.currentUser.email).subscribe((result) => { this.currentUserIsAdmin = result; });
      else {
        this.commentLikedMap = new Map<string, string>();

        // reload comment likes
        this.commentsService
          .get(this.encyclopediaItem.id)
          .subscribe((result: Comments[]) => {
            result.forEach(element => this.commentLikedMap.set(element.id, ''));
          });
          this.currentUserIsAdmin = false;
      }
    });

    this.route.paramMap.subscribe((params) => {
      this.encyclopediaService.getById(params.get('id')).subscribe(
        (item) => {
          if (item === null || item === undefined) {
            this._router.navigate(['']);
          }

          this.encyclopediaItem = item;
          this.matTableSource = new MatTableDataSource(item.files);

          // load related pages
          this.encyclopediaService
            .getRelatedPages(params.get('id'))
            .subscribe((result) => {
              this.relatedPages = result;
              this.recommendedSectionIsLoaded = true;
              this.relatedPages.forEach((value) => {
                value.pages.forEach((element) => {
                  element.color = this.generateLightColorHex();
                });
              });

              // load comments
              this.commentsService
                .get(item.id)
                .subscribe((result: Comments[]) => {
                  this.comments = result;
                  result.forEach((element) => {
                    this.mapCommentEditToggle.set(element.id, false);
                    this.commentLikedMap.set(element.id, '');
                    this.commentEditMap.set(element.id, element.comment);
                  });
                });
            });

          // load external pages
          this.encyclopediaService
            .getExternalPages(item.title, this.externalPageCardIndex + 1)
            .subscribe(
              (result) => {
                if (result == null || result.length == 0)
                  this.externalSectionLoadError = true;
                else this.externalPages[this.externalPageCardIndex] = result[0];

                this.externalSectionIsLoaded = true;
              },
              () => {
                this.externalSectionLoadError = true;
                this.externalSectionIsLoaded = true;
              }
            );

          this.isPageLoading = false;
        },
        () => {
          this._router.navigate(['']);
        }
      );
    });
  }

  openEditTitleDialog(): void {
    const dialogRef = this.dialog.open(EditTitleComponent, {
      width: '1000px',
      data: this.encyclopediaItem.title,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== null && result !== undefined) {
        this.encyclopediaService
          .updateEntry(this.encyclopediaItem.id, { title: result } as any)
          .subscribe(
            (data) => {
              this.encyclopediaItem.title = data.title;
              this._snackBar.open('Updated title!', 'Dismiss', {
                duration: 3000,
              });
            },
            (error: any) =>
              this._snackBar.open('Error updating title!', 'Dismiss', {
                duration: 3000,
              })
          );
      }
    });
  }

  openEditCategoriesDialog(): void {
    const myClonedArray: any[] = [];
    this.encyclopediaItem.category.forEach((val) =>
      myClonedArray.push(Object.assign({}, val))
    );

    const dialogRef = this.dialog.open(EditCategoryComponent, {
      width: '1000px',
      data: myClonedArray,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== null && result !== undefined) {
        this.encyclopediaService
          .updateEntry(this.encyclopediaItem.id, {
            category: result,
          } as any)
          .subscribe(
            (data) => {
              this.encyclopediaItem.category = data.category;
              this._snackBar.open('Updated categories!', 'Dismiss', {
                duration: 3000,
              });
            },
            (error: any) =>
              this._snackBar.open('Error updating categories!', 'Dismiss', {
                duration: 3000,
              })
          );
      }
    });
  }

  toggleOnEditDescription(): void {
    this.form.controls['data'].setValue(this.encyclopediaItem.richDescription);
    this.editDescriptionFlag = true;
  }

  toggleOffEditDescription() {
    this.editDescriptionFlag = false;
  }

  editDescription(): void {
    this.encyclopediaService
      .updateEntry(this.encyclopediaItem.id, {
        richDescription: this.form.controls['data'].value,
      } as any)
      .subscribe(
        (data) => {
          this.encyclopediaItem.richDescription = data.richDescription;
          this.editDescriptionFlag = false;
          this._snackBar.open('Updated description!', 'Dismiss', {
            duration: 3000,
          });
        },
        (error: any) =>
          this._snackBar.open('Error updating description!', 'Dismiss', {
            duration: 3000,
          })
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

  onChipClick(event: any) {
    this.categoryDataService.changeCategory(event.srcElement.outerText);
    this._router.navigate(['category']);
  }

  onRecommendedPageChipClick(id: string) {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.onSameUrlNavigation = 'reload';
    this._router.navigate([id]);
  }

  openDeletePromptDialog() {
    this.encyclopediaService.login().subscribe(
      (name) => {
        if (!this.dataService.getFlag()) {
          this._snackBar.open('Welcome ' + name + '!', 'Dismiss', {
            duration: 3000,
          });
          this.dataService.setFlag(true);
        }
        const dialogRef = this.dialog.open(DeletePromptDialogComponent, {});

        dialogRef.afterClosed().subscribe((result: boolean) => {
          if (result) {
            this.encyclopediaService
              .deleteEntry(this.encyclopediaItem.id)
              .subscribe(
                () => {
                  this.location.back();
                  this._snackBar.open(
                    'Deleted page from encyclopedia!',
                    'Dismiss',
                    {
                      duration: 3000,
                    }
                  );
                },
                (error: any) =>
                  this._snackBar.open(
                    'Error deleting page from encyclopedia!',
                    'Dismiss',
                    {
                      duration: 3000,
                    }
                  )
              );
          }
        });
      },
      (_error) => {
        this._snackBar.open('Unable to login!', 'Dismiss', {
          duration: 3000,
        });
      }
    );
  }

  onDownloadClick(file: Files) {
    this.fileService
      .downloadFile(file.mainId, file.fileName, file.fileType)
      .subscribe((response: any) => {
        let blob: any = new Blob([response], {
          type: file.fileType,
        });
        const url = window.URL.createObjectURL(blob);
        //window.open(url);
        saveAs(blob, file.fileName);
      }),
      (error: any) => console.log('Error downloading the file'),
      () => console.info('File downloaded successfully');
  }

  onPreviewClick(file: Files) {
    const dialogRef = this.dialog.open(PreviewFileComponent, {
      data: file,
      disableClose: true,
      width: '700px',
      height: '700px',
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  openEditFilesDialog(): void {
    const dialogRef = this.dialog.open(EditFilesComponent, {
      width: '1000px',
      disableClose: true,
      data: {
        id: this.encyclopediaItem.id,
        files: this.encyclopediaItem.files,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== null && result !== undefined) {
        this.encyclopediaItem.files = result;
        this.matTableSource = new MatTableDataSource(
          this.encyclopediaItem.files
        );
      }
    });
  }

  toggleEditMode() {
    if (this.showEditButtons == false)
      this.encyclopediaService.login().subscribe(
        (name) => {
          if (!this.dataService.getFlag()) {
            this._snackBar.open('Welcome ' + name + '!', 'Dismiss', {
              duration: 3000,
            });
            this.dataService.setFlag(true);
          }
          this.showEditButtons = true;
        },
        (_error) => {
          this._snackBar.open('Unable to login!', 'Dismiss', {
            duration: 3000,
          });
        }
      );
    else this.showEditButtons = false;
  }

  onCommentSubmitClick() {
    if (
      this.comment !== null &&
      this.comment !== undefined &&
      !this.isEmptyOrSpaces(this.comment) &&
      this.currentUser !== null
    ) {
      let comment = {
        mainId: this.encyclopediaItem.id,
        comment: this.comment,
        likes: 0,
        userName: this.currentUser.firstName + ' ' + this.currentUser.lastName,
        userSid: this.currentUser.email
      };
      this.commentsService
        .comment(comment as Comments)
        .subscribe((result: Comments) => {
          if (result !== null && result !== undefined) {
            this.comments = [result].concat(this.comments);
            this.mapCommentEditToggle.set(result.id, false);
            this.commentLikedMap.set(result.id, '');
          }
        });

      this.comment = '';
    }
    else {
      this._snackBar.open('Please login to comment!', 'Dismiss', {
        duration: 3000,
      });
    }
  }

  onDeleteCommentClick(comment: Comments) {
    this.commentsService.delete(comment.id, this.currentUser.email).subscribe(
      () => {
        this.comments.forEach((element, index) => {
          if (element.id === comment.id) this.comments.splice(index, 1);
        });
        this.mapCommentEditToggle.delete(comment.id);
        this.commentLikedMap.delete(comment.id);
      },
      (_error) => {
        this._snackBar.open('Something went wrong!', 'Dismiss', {
          duration: 3000,
        });
      }
    );
  }

  onCommentEditChange(commentId: string, event: any) {
    this.commentEditMap.set(commentId, event.srcElement.value);
  }

  onUpdateCommentClick(commentId: string, comment: string | undefined) {
    this.commentsService.update(commentId, comment as string, this.currentUser.email).subscribe(
      () => {
        this.comments.find((s) => s.id === commentId).comment = comment;
        this.mapCommentEditToggle.set(commentId, false);
        this.commentEditMap.set(commentId, comment as string);
      },
      (_error) => {
        this._snackBar.open('Something went wrong!', 'Dismiss', {
          duration: 3000,
        });
      }
    );
  }

  onLikeCommentClick(comment: Comments) {
    if (this.currentUser === null)
      this._snackBar.open('Please login to like!', 'Dismiss', {
        duration: 3000,
      });

    if (this.commentLikedMap.get(comment.id) === '') {
      this.commentsService.like(comment.id, this.currentUser.email).subscribe(
        () => {
          this.commentLikedMap.set(comment.id, 'warn');
          this.comments.find((s) => s.id === comment.id).likes++;
        },
        (_error) => {
          this.commentsService.disLike(comment.id, this.currentUser.email).subscribe(
            () => {
              this.commentLikedMap.set(comment.id, '');
              this.comments.find((s) => s.id === comment.id).likes--;
            },
            (_error) => { }
          );
        }
      );
    } else {
      this.commentsService.disLike(comment.id, this.currentUser.email).subscribe(
        () => {
          this.commentLikedMap.set(comment.id, '');
          this.comments.find((s) => s.id === comment.id).likes--;
        },
        (_error) => { }
      );
    }
  }

  isEmptyOrSpaces(str: string) {
    return str === null || str.match(/^ *$/) !== null;
  }

  openPageInfoDialog() {
    const dialogRef = this.dialog.open(PageInfoComponent, {
      data: this.encyclopediaItem,
    });
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  onExternalSectionNavigateLeft() {
    this.externalPageCardIndex =
      this.externalPageCardIndex == 0 ? 0 : this.externalPageCardIndex - 1;
  }

  onExternalSectionNavigateRight() {
    this.externalSectionIsLoaded = false;
    this.externalSectionNavigateRightButtonDisabled = true;
    this.externalPageCardIndex = this.externalPageCardIndex + 1;

    // load external pages
    this.encyclopediaService
      .getExternalPages(
        this.encyclopediaItem.title,
        this.externalPageCardIndex + 1
      )
      .subscribe(
        (result) => {
          if (result == null) this.externalSectionLoadError = true;
          else {
            this.externalPages[this.externalPageCardIndex] = result[0];
            this.externalSectionNavigateRightButtonDisabled = false;
          }
          this.externalSectionIsLoaded = true;
        },
        (error) => {
          this.externalSectionNavigateRightButtonDisabled = true;
        }
      );
  }
  generateLightColorHex() {
    let color = "#";
    for (let i = 0; i < 3; i++)
      color += ("0" + Math.floor(((1 + Math.random()) * Math.pow(16, 2)) / 2).toString(16)).slice(-2);
    return color;
  }
}
