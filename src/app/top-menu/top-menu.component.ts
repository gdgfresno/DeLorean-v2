import { SiteConfigService } from './../admin/shared/site-config/site-config.service';
import { FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { SiteConfig } from './../admin/shared/site-config/site-config';
import { AuthService } from './../services/auth/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { Router } from '@angular/router';
import {
    LocaleService,
    TranslationService,
    Language
} from 'angular-l10n';
import { $ } from 'protractor';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {
  @ViewChild('loginModal') public loginModal: ModalDirective;
  siteConfig: FirebaseObjectObservable<SiteConfig>;
  @Language() lang: string;

  countryMenuItems: any[] = [
    { text: 'English', language: 'en', country: 'US', currency: 'USD', numberingSystem: 'latn' },
    { text: 'Español', language: 'es', country: 'MX', currency: 'USD', numberingSystem: 'latn' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private siteConfigService: SiteConfigService,
    public locale: LocaleService,
    public translation: TranslationService
  ) { }

  ngOnInit() {
    this.siteConfig = this.siteConfigService.getConfig();
  }

  goHome() {
    this.loginModal.hide();
    this.router.navigate(['/home']);
  }

  googleLogin() {
    this.authService.googleLogin(() => this.goHome());
  }

  facebookLogin() {
    this.authService.facebookLogin(() => this.goHome());
  }

  twitterLogin() {
    this.authService.twitterLogin(() => this.goHome());
  }

  githubLogin() {
    this.authService.githubLogin(() => this.goHome());
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  isAnonymous() {
    return this.authService.anonymous();
  }

  userLogout() {
    this.authService.userLogout().then(() => this.goHome(), alert);
  }

  get currentLanguage(): string {
    return this.locale.getCurrentLanguage();
  }

  selectLocale(language: string, country: string, currency: string, numberingSystem: string): void {
    this.locale.setDefaultLocale(language, country, '', numberingSystem);
    this.locale.setCurrentCurrency(currency);
  }
}
