import * as firebase from 'firebase/app';

export class Speaker {
  $key: string;
  name: string;
  title: string;
  company: string;
  description: string;
  photoURL: File;
  googleLink: string;
  facebookLink: string;
  twitterLink: string;
  linkedinLink: string;
  githubLink: string;
  websiteLink: string;
  featured = false;
  timeStamp: any = firebase.database.ServerValue.TIMESTAMP;
  active = true;
  role: string;
}
