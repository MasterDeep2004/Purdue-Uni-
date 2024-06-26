import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Files } from 'src/app/models/files.model';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-preview-file',
  templateUrl: './preview-file.component.html',
  styleUrls: ['./preview-file.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewFileComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  @ViewChild('imageViewer') imageViewer!: ElementRef;
  @ViewChild('iframeRef', { static: false }) iframeRef!: ElementRef;

  imagePreview: any;
  docPreview: any;
  mediaPreview: any;
  mediaPreviewType: any;
  iframeLoaded: boolean = false;
  iframeTimer: any;

  constructor(
    public dialogRef: MatDialogRef<PreviewFileComponent>,
    private fileUploadService: FileUploadService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public fileDetails: Files
  ) {}

  ngOnInit(): void {
    if (this.checkDataTypeIsImage()) {
      this.fileUploadService
        .getViewableLink(this.fileDetails.mainId, this.fileDetails.fileName)
        .subscribe((result: any) => {
          this.imagePreview = result;
          this.imageViewer.nativeElement.setAttribute('src', this.imagePreview);
        });
    } else if (this.checkDataTypeIsDocument()) {
      this.fileUploadService
        .getViewableLink(this.fileDetails.mainId, this.fileDetails.fileName)
        .subscribe((result: string) => {
          this.docPreview = 'https://docs.google.com/gview?url=' + encodeURIComponent(result) + '&embedded=true';
           
          this.iframeRef.nativeElement.src = this.docPreview;

          this.iframeRef.nativeElement.onLoad(() => {
            this.iframeLoaded = true;
          });
        });
    } else if (this.checkDataTypeIsHTML5SupportedMedia()) {
      this.fileUploadService
        .getViewableLink(this.fileDetails.mainId, this.fileDetails.fileName)
        .subscribe((result: string) => {
          this.mediaPreview = result;
          this.mediaPreviewType = this.fileDetails.fileType;
          this.videoPlayer.nativeElement.setAttribute('src', this.mediaPreview);
          this.videoPlayer.nativeElement.setAttribute(
            'type',
            this.mediaPreviewType
          );
          this.videoPlayer.nativeElement.load();
        });
    }
  }

  ngAfterViewInit() {
    this.iframeTimer = setTimeout(() => {
      if (!this.iframeLoaded) {
        this.iframeRef.nativeElement.src = this.docPreview;
        clearTimeout(this.iframeTimer);
      }
    }, 3000);
  }

  onCloseClick() {
    if (
      this.checkDataTypeIsDocument() ||
      this.checkDataTypeIsHTML5SupportedMedia()
    ) {
      this.fileUploadService
        .destroyViewableLink(this.fileDetails.mainId, this.fileDetails.fileName)
        .subscribe(() => {
          // do something
        });
    }

    this.dialogRef.close();
  }

  checkDataTypeIsImage() {
    if (
      this.fileDetails.fileType == 'image/jpeg' ||
      this.fileDetails.fileType == 'image/png'
    )
      return true;
    else return false;
  }
  checkDataTypeIsDocument() {
    if (
      this.fileDetails.fileType == 'application/msword' ||
      this.fileDetails.fileType == 'application/vnd.ms-excel' ||
      this.fileDetails.fileType == 'application/pdf' ||
      this.fileDetails.fileType == 'text/plain' ||
      this.fileDetails.fileType ==
        'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      this.fileDetails.fileType ==
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      this.fileDetails.fileType ==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
      return true;
    else return false;
  }
  checkDataTypeIsHTML5SupportedMedia() {
    if (
      this.fileDetails.fileType == 'audio/mpeg' ||
      this.fileDetails.fileType == 'video/mp4' ||
      this.fileDetails.fileType == 'video/webm'
    )
      return true;
    else return false;
  }
}
