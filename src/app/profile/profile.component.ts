import { AuthService } from './../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import {
    TranslationService,
    Language
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
    public translation: TranslationService
  ) { }

  ngOnInit() {
    this.profile = this.authService.getProfile();
  }

}
