import { Component } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { delay, map, Observable, of } from 'rxjs';
import { passwordMatchValidator } from '../../shared/password-match.directive';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)], [this.asyncNameValidator()]],
    lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)], [this.asyncNameValidator()]],
    email: ['',[Validators.required,Validators.email]],
    password: ['',Validators.required],
    confirmPassword: ['',Validators.required],
    nationalid: ['', [Validators.required, Validators.pattern(/^[0-9]{14}$/)], [this.asyncNationalIdValidator()]],
  },{
    validators: [passwordMatchValidator]

  }

);

  get firstName() {
    return this.registerForm.controls['firstName'];
  }
  get lastName() {
    return this.registerForm.controls['lastName'];
  }
  get email() {
    return this.registerForm.controls['email'];
  }
  get password() {
    return this.registerForm.controls['password'];
  }
  get confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }
  get nationalid() {
    return this.registerForm.controls['nationalid'];
  }

  
  asyncNationalIdValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return of(control.value).pipe(
        delay(1000), // Simulate an async operation
        map(value => {
          // Simulate a check for existing national ID
          const existingNationalIds = ['12345678901234', '98765432109876'];
          return existingNationalIds.includes(value) ? { nationalIdExists: true } : null;
        })
      );
    };
  }
  asyncNameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return of(control.value).pipe(
        delay(1000), // Simulate an async operation
        map(value => {
          // Simulate a check for invalid full names
          const invalidFullNames = ['Invalid Name', 'Test Name'];
          return invalidFullNames.includes(value) ? { fullNameInvalid: true } : null;
        })
      );
    };
  }

  onSubmit(): void {
    const formData = this.registerForm.value;
    console.log('Form Data:', JSON.stringify(formData, null, 2)); // Print JSON data to console
    if (this.registerForm.valid) {
      this.http.post('http://localhost:8081/Home/users', this.registerForm.value).subscribe(
        (response: any) => {
          this.msgService.add({ severity: 'success', summary: 'Success', detail: 'Registration successful!' });
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Server error:', error);
          this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Registration failed. Please try again.' });
        }
      );
    }
  }
  constructor(    private fb: FormBuilder,
    private msgService: MessageService,
    private router: Router,
    private http: HttpClient
  ) { }
}
