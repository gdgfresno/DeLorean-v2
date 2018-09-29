import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'dontSanitizeHtml'})

// https://stackoverflow.com/questions/47528311/angular-5-sanitizing-html-with-pipe
// https://stackblitz.com/edit/angular-vjt27k?file=app%2Fsanitize-html.pipe.ts
export class DontSanitizeHtmlPipe implements PipeTransform  {

  constructor(private _sanitizer: DomSanitizer) { }

  transform(value:string):SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(value);
  }
}
