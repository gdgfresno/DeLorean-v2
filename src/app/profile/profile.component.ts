import { AuthService } from './../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import {
    LocaleService,
    TranslationService,
    Language,
    DefaultLocale
} from 'angular-l10n';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile: Object;
  @Language() lang: string;

  constructor(
    private authService: AuthService,
    public locale: LocaleService
  ) { }

  ngOnInit() {
    this.profile = this.authService.getProfile();
  }

}
