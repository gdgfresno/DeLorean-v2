import { SiteConfigService } from './admin/shared/site-config/site-config.service';
import { FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { SiteConfig } from './admin/shared/site-config/site-config';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthService } from './services/auth/auth.service';

import { mergeMap, map, filter } from 'rxjs/operators';

import { Direction } from '@angular/cdk/bidi';
import { LocaleService, TranslationService } from 'angular-l10n';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
/**
 * AppComponent class doesn't use decorators
 * because the view uses only directives and not the pipes to get the translation.
 */
export class AppComponent implements OnInit {
  siteConfig: FirebaseObjectObservable<SiteConfig>;
  eventName: string;

  dir: Direction;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private siteConfigService: SiteConfigService,
    private authService: AuthService,
    public locale: LocaleService,
    public translation: TranslationService
  ) { }

  ngOnInit() {
    this.siteConfig = this.siteConfigService.getConfig();

    this.siteConfig.subscribe(snap => {
      this.eventName = snap.eventName;
    });

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data))
      .subscribe((event) => {
        // dynamically set page titles
        let pageTitle = this.title.getTitle();
        if (this.eventName) {
          pageTitle = this.eventName;
        }
        if (event['title']) {
          pageTitle += ' :: ' + event['title'];
        }
        this.title.setTitle(pageTitle);
        // auto scroll to top on navigation
        window.scrollTo(0, 0);
      });

    // Initializes direction.
    this.dir = this.getLanguageDirection();

    this.authService.anonymousLogin()
      .then(() => console.log('Anonymous Login success'))
      .catch(err => console.log(`Anonymous Login error: ${err}`));
  }

  getLanguageDirection(language?: string): Direction {
    return this.locale.getLanguageDirection(language) as Direction;
  }
}
