import { inject, TestBed } from '@angular/core/testing';
import { DontSanitizeHtmlPipe } from './dont-sanitize-html.pipe';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';

// https://stackoverflow.com/questions/47514436/test-pipe-with-dependencies-on-services
describe('DontSanitizeHtmlPipe', () => {
  beforeEach(() => {
    TestBed
      .configureTestingModule({
        imports: [
          BrowserModule
        ]
      });
  });

  it('create an instance', inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
    let pipe = new DontSanitizeHtmlPipe(domSanitizer);
    expect(pipe).toBeTruthy();
  }));
});