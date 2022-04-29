import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'

import {AppComponent} from './app.component'
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'
import {FormsModule} from '@angular/forms'
import {RouterModule} from "@angular/router";
import { ModalComponent } from './modal/modal.component';
import { NewLotComponent } from './new-lot/new-lot.component';

@NgModule({
  declarations: [
    AppComponent,
    ModalComponent,

    NewLotComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    RouterModule.forRoot([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
