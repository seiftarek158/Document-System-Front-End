import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  })

  constructor(
    private fb: FormBuilder,
    @Inject(HttpClient) private http: HttpClient,
    private authService: AuthService,

    private router: Router,
    private msgService: MessageService
  ) { }

  get email() {
    return this.loginForm.controls['email'];
  }
  get password() { return this.loginForm.controls['password']; }

  // onSubmit() {
  //   if (this.loginForm.valid) {
  //     this.http.post('/api/login', this.loginForm.value).subscribe(
  //       (response: any) => {
  //         if (response.success) {
  //           // Handle successful login
  //           alert('Login successful!');
  //         } else {
  //           // Handle login failure
  //           alert('Email and password do not match. Please try again.');
  //         }
  //       },
  //       (error) => {
  //         // Handle server error
  //         alert('An error occurred. Please try again later.');
  //       }
  //     );
  //   }
  // }
 //         }
  //         else{
  //         // Handle server error
  //         console.error('Server error:', error);
  //         alert('An error occurred. Please try again later.');
  //         }
  //       }
  //     );
  //   }
  onSubmit() {
    const credentials = {      
      email: this.loginForm.get('email')?.value||'',
      password: this.loginForm.get('password')?.value||''
     };
     console.log('Credentials', credentials);
    this.authService.login(credentials).subscribe(
      response => {
        console.log('Response:', response);
        if (response.status === '200') {
          this.msgService.add({ severity: 'success', summary: 'Success', detail: 'Login successful!' });
          this.router.navigate(['/workspaceList']);
        }
      },
      error => {
        if (error.status === '401') {
          this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Invalid email or password' });
        } else {
          this.msgService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred. Please try again later.' });

        }
      }
    );
  }

}