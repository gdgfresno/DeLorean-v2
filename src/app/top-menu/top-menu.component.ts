import { SiteConfigService } from './../admin/shared/site-config/site-config.service';
import { FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { SiteConfig } from './../admin/shared/site-config/site-config';
import { AuthService } from './../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
    LocaleService,
    TranslationService,
    Language,
    DefaultLocale
} from 'angular-l10n';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {
  siteConfig: FirebaseObjectObservable<SiteConfig>;
  @Language() lang: string;

  countryMenuItems: any[] = [
    { text: 'English', language: 'en', country: 'US', currency: 'USD', numberingSystem: 'latn' },
    { text: 'Spanish', language: 'es', country: 'MX', currency: 'USD', numberingSystem: 'latn' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private siteConfigService: SiteConfigService,
    public locale: LocaleService
  ) { }

  ngOnInit() {
    this.siteConfig = this.siteConfigService.getConfig();
  }

  userLogin() {
    this.authService.userLogin().then(() => this.router.navigate(['/home']), alert);
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  userLogout() {
    this.authService.userLogout().then(() => this.router.navigate(['/home']), alert);
  }

  get currentLanguage(): string {
    return this.locale.getCurrentLanguage();
  }

  selectLocale(language: string, country: string, currency: string, numberingSystem: string): void {
    this.locale.setDefaultLocale(language, country, '', numberingSystem);
    this.locale.setCurrentCurrency(currency);
  }
}
