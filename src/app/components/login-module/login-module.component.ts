import { Component, OnInit, Output } from '@angular/core';
import { Injectable } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Login } from '../../shared/models/login.model';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
// import * as moment from "moment";


@Component({
  selector: 'app-login-module',
  templateUrl: './login-module.component.html',
  styleUrls: ['./login-module.component.scss']
})

@Injectable()
export class LoginModuleComponent implements OnInit {

  @Output() errorMessage: string;

  login = {} as Login;
  loginError = false;

  // cookie vars
  event: boolean;
  username: any;
  password: any;
  cookieValueUsername: any;
  cookieValuePassword: any;

  constructor(private cookie: CookieService,
              private loginService: LoginService,
              private router: Router) { }

  ngOnInit() {
    // this.username = document.getElementById('username');
    // this.password = document.getElementById('password');

    this.username = this.cookie.get('username');
    this.password = this.cookie.get('password');
  }

  onRememberMe(event: any) {
    this.event = event.target.checked;
  }

  loginClicked(email: string, pwd: string, role: any) {
    // console.log('Login method called...');
    this.cookieValueUsername = this.cookie.get('username');
    this.cookieValuePassword = this.cookie.get('password');

    if (this.event) {
      // set cookies
      this.cookie.set('username', email, 1);
      this.cookie.set('password', pwd, 1);
    }

    this.login = {
      email,
      password: pwd,
      role
    };

    this.loginService.login(this.login).subscribe(
      data => {
        // Navigate to purchase
        this.router.navigate(['/purchase']);
        // Set sessiontoken
        this.setSession(data.token);
        // disable login error message
        this.loginError = false;

        // console.log(localStorage.getItem('id_token'));
      },
      error => {
        // console.log(error);
        this.loginError = true;
        this.errorMessage = error.statusText + ': Invalid username or password!';

      }
    );

    // Returning false to prevent the page from updating
    return false;
  }

  private setSession(token: any) {
    // const expiresAt = moment().add(authResult.expiresIn,'second');

    localStorage.setItem('id_token', token);
    const payload = atob(token.split('.')[1]);
    const userId = JSON.parse(payload).UserId;
    localStorage.setItem('user_id', userId);
    // localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
  }
}
