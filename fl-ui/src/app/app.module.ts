import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { MatTableModule, MatRadioModule, MatInputModule, MatFormFieldModule, MatNativeDateModule } from '@angular/material';
import { MatDatepickerModule,  } from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
      { enableTracing: false } // <-- debugging purposes only
    ),
    MatTableModule, MatRadioModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, MatInputModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
