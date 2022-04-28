import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { urlGoogleIcon } from 'src/environments/url';
import { IUser, IUserData } from '../shared/interfaces';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  form!: FormGroup;
  submitted = false;
  message!: string;
  googleImg = `${urlGoogleIcon}` ;
  error$: Subject<string> = new Subject<string>();
  constructor(public auth: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if(params.login){
        this.message = 'Please enter a data'
      } else if(params.authFailed) {
        this.message = 'Session is over. Enter data again'
      }
    })

    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }

  onSubmit(): void {
    if(this.form.invalid){
      return;
    }

    this.submitted = true;

    const user: IUserData = {
      email: this.form.value.email,
      password: this.form.value.password
    }

    this.auth.login(user).subscribe({
      next: (res) => {
        this.form.reset();
        this.router.navigate(['/posts']);
        this.submitted = false;
      },
      error: (err) => {
        const errorMessage = err.error.message;
        switch(errorMessage) {
          case 'Error validation':
            this.error$.next('Invalid Data')
            break;
          case 'INVALID_EMAIL_LOG':
            this.error$.next('Wrong Email')
            break;
          case 'WRONG_PASS_LOG':
            this.error$.next('Wrong password');
            break;
        }
        this.submitted = false
      }
    });
  }
}
