import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

import { MenuController, Platform, ToastController } from '@ionic/angular';

import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

import { Storage } from '@ionic/storage';

import { UserData } from './providers/user-data';

import { initialize, Event } from '@harnessio/ff-javascript-client-sdk';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  appPages = [
    {
      title: 'Schedule',
      url: '/app/tabs/schedule',
      icon: 'calendar'
    },
    {
      title: 'Speakers',
      url: '/app/tabs/speakers',
      icon: 'people'
    },
    {
      title: 'Map',
      url: '/app/tabs/map',
      icon: 'map'
    },
    {
      title: 'About',
      url: '/app/tabs/about',
      icon: 'information-circle'
    }
  ];
  loggedIn = false;
  dark = false;

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private storage: Storage,
    private userData: UserData,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
  ) {
    this.initializeApp();
  }

  async ngOnInit() {
    this.checkLoginStatus();
    this.listenForLoginEvents();

    this.swUpdate.available.subscribe(async res => {
      const toast = await this.toastCtrl.create({
        message: 'Update available!',
        position: 'bottom',
        buttons: [
          {
            role: 'cancel',
            text: 'Reload'
          }
        ]
      });

      await toast.present();

      toast
        .onDidDismiss()
        .then(() => this.swUpdate.activateUpdate())
        .then(() => window.location.reload());
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {      
      if (this.platform.is('hybrid')) {
        StatusBar.hide();
        SplashScreen.hide();
      }

       // 8d04ece2-696a-45ee-be19-3904480674f4 - staging
      // dc1ba2ba-2ce5-4fcd-862c-4b1d3c4db12f - prod

      const client = initialize('30752809-535b-4f1d-978e-da6bca648944', {
        identifier: 'Skills',      // Target identifier
        name: 'Skills'
      })

      const client_1 = initialize('30752809-535b-4f1d-978e-da6bca648944', {
        identifier: 'Skills_groups',      // Target identifier
        name: 'Skills_groups'
      })

      // client.on(Event.READY, flags => {
      //   console.log("READY :", flags);
      //   // Event happens when connection to server is established
      //   // flags contains all evaluations against SDK key
      // })
      
      // client.on(Event.FLAGS_LOADED, evaluations => {
      //   console.log("FLAGS_LOADED :", evaluations);
      //   // Event happens when flags are loaded from the server
      // })
      
      // client.on(Event.CACHE_LOADED, evaluations => {
      //   console.log("CACHE_LOADED :", evaluations);
      //   // Event happens when flags are loaded from the cache
      // })
      
      client.on(Event.CHANGED, flagInfo => {
        console.log("Skills :", flagInfo.value);
        // Event happens when a changed event is pushed
        // flagInfo contains information about the updated feature flag
      })

      client_1.on(Event.CHANGED, flagInfo => {
        console.log("Skills_groups :", flagInfo.value);
        // Event happens when a changed event is pushed
        // flagInfo contains information about the updated feature flag
      })
      
      // client.on(Event.DISCONNECTED, () => {
      //   console.log("DISCONNECTED");
      //   // Event happens when connection is disconnected
      // })
      
      // client.on(Event.ERROR, error => {
      //   console.log("ERROR :", error);
      //   // Event happens when connection some error has occurred
      // })
     
      // client.on(Event.ERROR_AUTH, error => {
      //   console.log("ERROR_AUTH :", error);
      //   // Event happens when unable to authenticate
      // })
      
      // client.on(Event.ERROR_FETCH_FLAGS, error => {
      //   console.log("ERROR_FETCH_FLAGS :", error);
      //   // Event happens when unable to fetch flags from the service
      // })
      
      // client.on(Event.ERROR_FETCH_FLAG, error => {
      //   console.log("ERROR_FETCH_FLAG :", error);
      //   // Event happens when unable to fetch an individual flag from the service
      // })
      
      // client.on(Event.ERROR_METRICS, error => {
      //   console.log("ERROR_METRICS :", error);
      //   // Event happens when unable to report metrics back to the service
      // })
      
      // client.on(Event.ERROR_STREAM, error => {
      //   console.log("ERROR_STREAM :", error);
      //   // Event happens when the stream returns an error
      // })
    });
  }

  checkLoginStatus() {
    return this.userData.isLoggedIn().then(loggedIn => {
      return this.updateLoggedInStatus(loggedIn);
    });
  }

  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
    }, 300);
  }

  listenForLoginEvents() {
    window.addEventListener('user:login', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:signup', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:logout', () => {
      this.updateLoggedInStatus(false);
    });
  }

  logout() {
    this.userData.logout().then(() => {
      return this.router.navigateByUrl('/app/tabs/schedule');
    });
  }

  openTutorial() {
    this.menu.enable(false);
    this.storage.set('ion_did_tutorial', false);
    this.router.navigateByUrl('/tutorial');
  }
}
