import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { urlGoogleIcon } from 'src/environments/url';
import { IUser } from '../shared/interfaces';
import { MyValidators } from '../shared/my.validators';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.scss']
})
export class RegistrationPageComponent implements OnInit {


  submitted!: boolean;
  form!: FormGroup;
  originPass!: string;
  googleImg = `${urlGoogleIcon}` ;
  constructor(public authService: AuthService, private router: Router) { }

  checkInput(event: Event): void {
    this.originPass = (event.target as HTMLInputElement).value;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email], [MyValidators.createValidator(this.authService)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(6)])
    },
      MyValidators.checkConfirmPassword('password', 'confirmPassword')
    );
  }

  onSubmit(): void {
    if(this.form.invalid) {
      return;
    }

    this.submitted = true;
    const newUser: IUser = {
      name: this.form.value.name,
      email: this.form.value.email.toLowerCase(),
      password: this.form.value.password
    }

    this.authService.registration(newUser).subscribe({
      next: () => {
        this.form.reset();
        this.router.navigate(['/posts']);
        this.submitted = false;
      }
    });

  }

}
