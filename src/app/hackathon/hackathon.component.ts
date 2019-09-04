import { SiteConfigService } from './../admin/shared/site-config/site-config.service';
import { FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { SiteConfig } from './../admin/shared/site-config/site-config';
import { Component, OnInit } from '@angular/core';
import {
    TranslationService,
    Language
} from 'angular-l10n';

@Component({
  selector: 'app-hackathon',
  templateUrl: './hackathon.component.html',
  styleUrls: ['./hackathon.component.scss']
})
export class HackathonComponent implements OnInit {
  siteConfig: FirebaseObjectObservable<SiteConfig>;
  @Language() lang: string;

  constructor(
    private siteConfigService: SiteConfigService,
    public translation: TranslationService
  ) { }

  ngOnInit() {
    this.siteConfig = this.siteConfigService.getConfig();
  }

}
