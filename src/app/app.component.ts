import { SiteConfigService } from './admin/shared/site-config/site-config.service';
import { FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { SiteConfig } from './admin/shared/site-config/site-config';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { mergeMap, map, filter } from 'rxjs/operators';

import { Direction } from '@angular/cdk/bidi';
import { Subscription } from 'rxjs';
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
export class AppComponent implements OnInit, OnDestroy {
  siteConfig: FirebaseObjectObservable<SiteConfig>;
  eventName: string;

  countryMenuItems: any[] = [
    { text: 'United States', language: 'en', country: 'US', currency: 'USD', numberingSystem: 'latn' },
    { text: 'Spanish', language: 'es', country: 'MX', currency: 'USD', numberingSystem: 'latn' },
  ];

  get currentCountry(): string {
    return this.locale.getCurrentCountry();
  }

  get currentNumberingSystem(): string {
    return this.locale.getCurrentNumberingSystem();
  }

  dir: Direction;

  subscription: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public title: Title,
    private siteConfigService: SiteConfigService,
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
        let pageTitle = this.translation.translate('App.Title');
        if (event['title']) {
          pageTitle += ' :: ' + event['title'];
        }
        this.title.setTitle(pageTitle);
        // auto scroll to top on navigation
        window.scrollTo(0, 0);
      });

    // When the language changes, refreshes the document title with the new translation.
    this.subscription = this.translation.translationChanged().subscribe(
      () => {
        let pageTitle = this.title.getTitle();
        let appTitle = this.translation.translate('App.Title');
        if (pageTitle.indexOf(' :: ') >= 0) {
          let titleParts = pageTitle.split(' :: ');
          pageTitle = appTitle + ' :: ' + titleParts[1];
        } else {
          pageTitle = appTitle;
        }
        this.title.setTitle(pageTitle);
      }
    );

    // Initializes direction.
    this.dir = this.getLanguageDirection();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getLanguageDirection(language?: string): Direction {
    return this.locale.getLanguageDirection(language) as Direction;
  }

  selectLocale(language: string, country: string, currency: string, numberingSystem: string): void {
    this.locale.setDefaultLocale(language, country, '', numberingSystem);
    this.locale.setCurrentCurrency(currency);
  }
}
