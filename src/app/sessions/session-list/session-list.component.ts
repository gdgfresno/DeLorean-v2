import { SpeakerService } from './../../speakers/shared/speaker.service';
import { Router } from '@angular/router';
import { SectionService } from './../shared/section.service';
import { AuthService } from './../../services/auth/auth.service';
import { SessionService } from './../shared/session.service';
import { Session } from './../shared/session';
import { Section } from './../shared/section';
import { FirebaseListObservable } from 'angularfire2/database-deprecated';
import { FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { SiteConfig } from './../../admin/shared/site-config/site-config';
import { SiteConfigService } from './../../admin/shared/site-config/site-config.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import {
    TranslationService,
    Language,
    DefaultLocale
} from 'angular-l10n';

@Component({
  selector: 'app-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.scss'],
  providers: [ModalDirective]
})
export class SessionListComponent implements OnInit {
  public sessions: FirebaseListObservable<Session[]>;
  public sections: FirebaseListObservable<Section[]>;

  siteConfig: FirebaseObjectObservable<SiteConfig>;

  section: Section = new Section();
  @Language() lang: string;
  @DefaultLocale() defaultLocale: string;

  @ViewChild('sectionModal') public sectionModal: ModalDirective;

  constructor(
    private sessionService: SessionService,
    private sectionService: SectionService,
    private speakerService: SpeakerService,
    private siteConfigService: SiteConfigService,
    private authService: AuthService,
    private router: Router,
    public translation: TranslationService
  ) { }

  ngOnInit() {
    this.sessions = this.sessionService.getSessionList({ orderByChild: 'rank' });
    this.sections = this.sectionService.getSectionList({ orderByChild: 'rank' });
    this.siteConfig = this.siteConfigService.getConfig();
}

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  openDetails(session) {
    if ((this.isLoggedIn() && this.isAdmin()) || session.abstract) {
      this.router.navigate([`/sessions/${session.$key}`]);
    }
  }

  addSection(title, rank) {
    this.section.title = title.replace(/^\s+|\s+$/g, '');
    const integerRegex = new RegExp('^\\d+$');
    this.section.rank = integerRegex.test(rank) ? parseInt(rank, 10) : 0;
    this.sectionService.createSection(this.section);
    this.section = new Section();
    this.sectionModal.hide();
  }

  deleteSection(section) {
    if (window.confirm('Are you sure you want to delete this section? This WILL orphan any sessions tied to it!')) {
      this.sectionService.deleteSection(section.$key);
    }
  }

  getSpeakerName(speakerKey) {
    return this.speakerService.getSpeakerName(speakerKey);
  }

}
