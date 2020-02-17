import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import * as firebase from 'firebase/app';

type SimpleFn = () => void;

const supportedPopupSignInMethods = [
  firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  firebase.auth.TwitterAuthProvider.PROVIDER_ID,
  firebase.auth.GithubAuthProvider.PROVIDER_ID,
];

@Injectable()
export class AuthService {
  public userId: string = null;
  public displayName: string = null;
  public email: string = null;
  public isAnonymous = true;  // For potential account merge later
  public anonymousUser: firebase.User = null;   // For potential account merge later

  constructor(public afAuth: AngularFireAuth, public afDatabase: AngularFireDatabase) {
    afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.displayName = user.displayName;
        this.email = user.email;
        this.isAnonymous = user.isAnonymous;
        if (this.isAnonymous) {
          this.anonymousUser = user;
        }
      }
    });
  }

  anonymousLogin(): Promise<any> {
    return this.afAuth.auth.signInAnonymously();
  }

  upgradeAccount(credential: firebase.auth.AuthCredential, providerId: string, secondTry = false): Promise<any> {
    let that = this;
    // let currentUser = this.afAuth.auth.currentUser;
    return this.afAuth.auth.currentUser.linkWithCredential(credential)
      .then((usercred) => {
        console.log(`Anonymous account successfully upgraded ${usercred}`);
      }, (error) => {
        if (error.code === 'auth/provider-already-linked') {
          return that.afAuth.auth.currentUser.unlink(providerId)
            .then(() => this.afAuth.auth.currentUser.linkWithCredential(credential));
        } else {
          console.log(`Error upgrading anonymous account: ${error.code}`);
        }
      });
  }

  handleLogin(providerId: string, afterAction: SimpleFn): Promise<any> {
    return this.afAuth.auth.signInWithPopup(this.getProvider(providerId))
      .then((result) => this.upgradeAccount(result.credential, providerId), (error) => this.handleError(error))
      .then(afterAction);
  }

  googleLogin(afterAction: SimpleFn): Promise<any> {
    return this.handleLogin(firebase.auth.GoogleAuthProvider.PROVIDER_ID, afterAction);
  }

  facebookLogin(afterAction: SimpleFn): Promise<any> {
    return this.handleLogin(firebase.auth.FacebookAuthProvider.PROVIDER_ID, afterAction);
  }

  twitterLogin(afterAction: SimpleFn): Promise<any> {
    return this.handleLogin(firebase.auth.TwitterAuthProvider.PROVIDER_ID, afterAction);
  }

  githubLogin(afterAction: SimpleFn): Promise<any> {
    return this.handleLogin(firebase.auth.GithubAuthProvider.PROVIDER_ID, afterAction);
  }

  getProvider(providerId) {
    switch (providerId) {
      case firebase.auth.GoogleAuthProvider.PROVIDER_ID:
        return new firebase.auth.GoogleAuthProvider();
      case firebase.auth.FacebookAuthProvider.PROVIDER_ID:
        return new firebase.auth.FacebookAuthProvider();
      case firebase.auth.TwitterAuthProvider.PROVIDER_ID:
        return new firebase.auth.TwitterAuthProvider();
      case firebase.auth.GithubAuthProvider.PROVIDER_ID:
        return new firebase.auth.GithubAuthProvider();
      default:
        throw new Error(`No provider implemented for ${providerId}`);
    }
  }

  handleError(error) {
    if (error.email && error.credential && error.code === 'auth/account-exists-with-different-credential') {
      return this.afAuth.auth.fetchProvidersForEmail(error.email)
        .then((providers) => {
          const firstProviderMethod = providers.find(p => supportedPopupSignInMethods.includes(p));
          if (!firstProviderMethod) {
            console.log(`Your account is linked to a provider that isn't supported.`);
          }

          const linkedProvider = this.getProvider(firstProviderMethod);
          linkedProvider.setCustomParameters({ login_hint: error.email });

          return this.afAuth.auth.signInWithPopup(linkedProvider)
            .then((result) => result.user.linkWithCredential(error.credential));
        });
    } else {
      console.log(`Unhandled error ${error.code}`);
    }
  }

  getProfile() {
    return this.afDatabase.object(`/userProfile/${this.userId}/`);
  }

  isLoggedIn() {
    return !!(this.userId !== null);
  }

  userLogout(): Promise<void> {
    this.userId = null;
    this.displayName = null;
    this.email = null;
    return this.afAuth.auth.signOut();
  }

  anonymous() {
    return this.isAnonymous;
  }

  isAdmin() {
    let isAdmin: boolean;
    this.afDatabase.object(`/admins/${this.userId}`).subscribe(snapshot => {
      isAdmin = snapshot.$value;
    });
    return isAdmin;
  }

}
