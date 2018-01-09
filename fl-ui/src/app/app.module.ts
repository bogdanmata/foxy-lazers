import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { SectionRbcComponent } from './section-rbc/section-rbc.component';
import { SectionBorrowerComponent } from './section-borrower/section-borrower.component';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
  { path: 'rbc', component: SectionRbcComponent },
  { path: 'borrower', component: SectionBorrowerComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    SectionRbcComponent,
    SectionBorrowerComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
