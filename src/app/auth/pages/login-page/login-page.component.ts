import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2'

@Component({
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  private fb = inject( FormBuilder );
  private authService = inject( AuthService );

  public myForm: FormGroup = this.fb.group({
    email: ['noa@google.com', [ Validators.required, Validators.email ]],
    password: ['1234567', [ Validators.required, Validators.minLength(6) ]],
  })

  isNotValidField(field: string): boolean | null {
    return this.myForm.controls[field].errors
    && this.myForm.controls[field].touched;
  }

  getFieldError(field: string): string | null {

    if ( !this.myForm.controls[field] ) return null;

    const errores = this.myForm.controls[field].errors || {};

    for (const key of Object.keys(errores)) {
      switch( key ) {
        case 'required':
          return 'Field required';

        case 'email':
          return 'Please enter a valid email.';

        case 'minlength':
          return `This field needs a minimum of ${ errores['minlength'].requiredLength } characters.`;
      }
    }

    return null;
  }

  login() {
const { email, password } = this.myForm.value;

    this.authService.login(email, password)
    .subscribe({
      next: () => console.log('Todo bien!'),
      error: (message) => {
        Swal.fire('Error', message, 'error')
      }
    })

  }

}
