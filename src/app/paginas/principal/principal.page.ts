import { Component, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { SwipeTabDirective } from '../../directivas/swipe-tab.directive';

@Component({
  selector: 'app-principal',
  templateUrl: 'principal.page.html',
  styleUrls: ['principal.page.scss'],
})

export class PrincipalPage {
  @ViewChild(SwipeTabDirective, { static: false }) swipeTabDirective: SwipeTabDirective;
  @ViewChild('myTabs2', { static: false }) tabRef: IonTabs;

  constructor(  ) { }

  ionTabsDidChange($event) {
    console.log('[PrincipalPage] ionTabsDidChange, $event: ', $event);
    this.swipeTabDirective.onTabInitialized($event.tab);
  }

  onTabChange($event) {
    console.log('[PrincipalPage] onTabChange, $event: ', $event);
    this.tabRef.select($event);
  }
}
