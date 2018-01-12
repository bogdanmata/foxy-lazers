import { Component, OnInit } from '@angular/core';
import {CommonService} from "./common.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public commonService: CommonService) {
    // Execute contracts called regularly
    this.callExecuteContracts();
  }

  callExecuteContracts() {
    setTimeout(() => {
      console.log('Executing contracts...');
      this.commonService.executeContracts().subscribe(data => {
        this.callExecuteContracts();
      });
    }, 10000)
  }
}
