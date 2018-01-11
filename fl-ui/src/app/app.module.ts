import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {
  MatExpansionModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatProgressSpinnerModule,
  MatRadioModule, MatTableModule, MatToolbarModule
} from '@angular/material';
import {MatDatepickerModule,} from '@angular/material/datepicker';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

import {AppComponent} from './app.component';
import {SectionRbcComponent} from './section-rbc/section-rbc.component';
import {SectionBorrowerComponent} from './section-borrower/section-borrower.component';
import {HomeComponent} from './home/home.component';
import {CommonService} from "./common.service";
import {FlHeaderComponent} from './fl-header/fl-header.component';
import {FlSpinnerComponent} from './fl-spinner/fl-spinner.component';
import {FinalCountdownPipe} from './pipe/final-countdown.pipe';
import {FinalCountdownComponent} from './components/final-countdown/final-countdown.component';

const appRoutes: Routes = [
  {path: 'bank', component: SectionRbcComponent},
  {path: 'borrower', component: SectionBorrowerComponent},
  {path: '**', component: HomeComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    SectionRbcComponent,
    SectionBorrowerComponent,
    HomeComponent,
    FlHeaderComponent,
    FlSpinnerComponent,
    FinalCountdownPipe,
    FinalCountdownComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false} // <-- debugging purposes only
    ),
    MatTableModule, MatRadioModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, MatInputModule,
    BrowserAnimationsModule, MatSelectModule, MatAutocompleteModule, MatButtonModule, FormsModule, ReactiveFormsModule,
    MatExpansionModule, MatToolbarModule, MatIconModule, MatProgressSpinnerModule
  ],
  providers: [CommonService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
