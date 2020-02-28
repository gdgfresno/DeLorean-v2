import { Router } from '@angular/router';
import { AuthService } from './../../services/auth/auth.service';
import { SpeakerService } from './../shared/speaker.service';
import { Speaker } from './../shared/speaker';
import { FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { Observable } from 'rxjs';
import {
    TranslationService,
    Language,
    DefaultLocale
} from 'angular-l10n';

@Component({
  selector: 'app-speaker-list',
  templateUrl: './speaker-list.component.html',
  styleUrls: ['./speaker-list.component.scss']
})
export class SpeakerListComponent implements OnInit {
  @ViewChild('speakerModal') public speakerModal: ModalDirective;

  public speakers: FirebaseListObservable<Speaker[]>;
  public roles: string[] = ['Speaker', 'Mentor', 'Organizer', ''];
  public speakerDetail: any;
  @Language() lang: string;
  @DefaultLocale() defaultLocale: string;

  constructor(
    private speakerService: SpeakerService,
    private authService: AuthService,
    private router: Router,
    public translation: TranslationService
  ) { }

  ngOnInit() {
    this.speakers = this.speakerService.getSpeakerList({ orderByChild: 'name' });
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  deleteSpeaker(speaker) {
    if (window.confirm('Are you sure you want to delete this speaker?')) {
      this.speakerService.deleteSpeaker(speaker.$key);
    }
  }

  showModal(speaker) {
    this.speakerDetail = {
      name: speaker.name,
      title: speaker.title,
      company: speaker.company,
      description: speaker.description,
      googleLink: speaker.googleLink,
      facebookLink: speaker.facebookLink,
      twitterLink: speaker.twitterLink,
      linkedinLink: speaker.linkedinLink,
      githubLink: speaker.githubLink,
      websiteLink: speaker.websiteLink
    };
    this.speakerModal.show();
  }

}
