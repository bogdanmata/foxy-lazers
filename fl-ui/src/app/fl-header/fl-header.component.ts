import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-fl-header',
  templateUrl: './fl-header.component.html',
  styleUrls: ['./fl-header.component.scss']
})
export class FlHeaderComponent implements OnInit {
  @Input()
  appName: string;

  @Input()
  login: string;

  @Input()
  className: string;

  @Input()
  loginList: string[];

  @Output()
  loginUpdated = new EventEmitter<string>();

  isChangingUser: boolean = false;
  newLogin: string;

  constructor() { }

  ngOnInit() {
  }

  changeUser(): void {
    this.newLogin = this.login;
    this.isChangingUser = !this.isChangingUser;
  }

  validateUser(): void {
    this.isChangingUser = false;
    this.login = this.newLogin;
    this.loginUpdated.emit(this.newLogin);
  }
}
