import { SiteConfigService } from './../admin/shared/site-config/site-config.service';
import { SiteConfig } from './../admin/shared/site-config/site-config';
import { FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { Component, OnInit } from '@angular/core';
import {
    LocaleService,
    TranslationService,
    Language,
    DefaultLocale
} from 'angular-l10n';

@Component({
  selector: 'app-coc',
  templateUrl: './coc.component.html',
  styleUrls: ['./coc.component.scss']
})
export class CocComponent implements OnInit {
  siteConfig: FirebaseObjectObservable<SiteConfig>;
  @Language() lang: string;

  constructor(
    private siteConfigService: SiteConfigService,
    public locale: LocaleService
  ) { }

  ngOnInit() {
    this.siteConfig = this.siteConfigService.getConfig();
  }

}
