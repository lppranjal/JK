// src/app/signup.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <div class="signup-container">
      <h2>Sign Up</h2>
      <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
        <!-- Account Type Section -->
        <div class="form-group">
          <label>Account Type:</label>
          <div class="radio-group">
            <label>
              <input type="radio" formControlName="accountType" value="User" /> User
            </label>
            <label>
              <input type="radio" formControlName="accountType" value="Host/Service" /> Host/Service
            </label>
          </div>
        </div>

        <!-- Conditional Fields for User Account -->
        <div *ngIf="isUserSelected">
          <div class="form-group">
            <label for="firstName">First Name:</label>
            <input id="firstName" type="text" formControlName="firstName" placeholder="Enter your first name" />
          </div>
          <div class="form-group">
            <label for="lastName">Last Name:</label>
            <input id="lastName" type="text" formControlName="lastName" placeholder="Enter your last name" />
          </div>
        </div>

        <!-- Conditional Fields for Host/Service Account -->
        <div *ngIf="isHostSelected">
          <div class="form-group">
            <label>Service Type:</label>
            <div class="radio-group">
              <label>
                <input type="radio" formControlName="serviceType" value="Shop" /> Shop
              </label>
              <label>
                <input type="radio" formControlName="serviceType" value="School/Tuition" /> School/Tuition
              </label>
            </div>
          </div>
          <div class="form-group">
            <label for="serviceName">Service Name:</label>
            <input id="serviceName" type="text" formControlName="serviceName" placeholder="Enter your service name" />
          </div>
        </div>

        <!-- Common Fields -->
        <div class="form-group">
          <label for="email">Email:</label>
          <input id="email" type="email" formControlName="email" placeholder="Enter your email" required />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input id="password" type="password" formControlName="password" placeholder="Enter your password" required />
        </div>

        <button type="submit" [disabled]="signupForm.invalid">Sign Up</button>
      </form>
    </div>
  `,
  styles: [`
    .signup-container {
      max-width: 500px;
      margin: 40px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 6px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      background-color: #fff;
    }
    h2 {
      text-align: center;
      margin-bottom: 20px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }
    .radio-group {
      display: flex;
      gap: 15px;
    }
    input[type="text"],
    input[type="email"],
    input[type="password"] {
      width: 100%;
      padding: 8px;
      box-sizing: border-box;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    input[type="radio"] {
      margin-right: 5px;
    }
    button {
      width: 100%;
      padding: 10px;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    button:disabled {
      background-color: #ccc;
    }
    button:hover:not(:disabled) {
      background-color: #218838;
    }
  `]
})
export class SignUpComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // Initialize the form with all possible controls.
    this.signupForm = this.fb.group({
      accountType: ['', Validators.required],
      // Fields for User account
      firstName: [''],
      lastName: [''],
      // Fields for Host/Service account
      serviceType: [''],
      serviceName: [''],
      // Common fields
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Set conditional validators based on account type.
    this.signupForm.get('accountType')?.valueChanges.subscribe(value => {
      if (value === 'User') {
        // Require user fields and clear host/service validators.
        this.signupForm.get('firstName')?.setValidators([Validators.required]);
        this.signupForm.get('lastName')?.setValidators([Validators.required]);
        this.signupForm.get('serviceType')?.clearValidators();
        this.signupForm.get('serviceName')?.clearValidators();
      } else if (value === 'Host/Service') {
        // Require host/service fields and clear user validators.
        this.signupForm.get('serviceType')?.setValidators([Validators.required]);
        this.signupForm.get('serviceName')?.setValidators([Validators.required]);
        this.signupForm.get('firstName')?.clearValidators();
        this.signupForm.get('lastName')?.clearValidators();
      }
      // Update the validity of all controls.
      this.signupForm.get('firstName')?.updateValueAndValidity();
      this.signupForm.get('lastName')?.updateValueAndValidity();
      this.signupForm.get('serviceType')?.updateValueAndValidity();
      this.signupForm.get('serviceName')?.updateValueAndValidity();
    });
  }

  // Helper getters to conditionally display form sections.
  get isUserSelected() {
    return this.signupForm.get('accountType')?.value === 'User';
  }

  get isHostSelected() {
    return this.signupForm.get('accountType')?.value === 'Host/Service';
  }

  onSubmit() {
    if (this.signupForm.valid) {
      // Adjust the URL to match your registration endpoint.
      this.http.post('https://your-api-url/api/account/register', this.signupForm.value)
        .subscribe({
          next: () => {
            alert('Registration successful!');
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error(err);
            alert('Registration failed. Please try again.');
          }
        });
    }
  }
}
