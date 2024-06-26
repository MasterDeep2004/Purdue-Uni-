import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

/**
 * Generated class for the SafeHtmlPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(private sanitizer:DomSanitizer){}

  transform(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

@Pipe({
  name: 'safeUrl',
})
export class SafeUrlPipe implements PipeTransform {

  constructor(private sanitizer:DomSanitizer){}

  transform(html: string) {
    return this.sanitizer.bypassSecurityTrustUrl(html);
  }
}

@Pipe({
  name: 'safeResourceUrl',
})
export class SafeResourceUrlPipe implements PipeTransform {

  constructor(private sanitizer:DomSanitizer){}

  transform(html: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(html);
  }
}