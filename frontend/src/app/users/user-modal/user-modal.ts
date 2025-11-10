import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, User } from '../user';

@Component({
  selector: 'app-user-modal',
  standalone: false,
  templateUrl: './user-modal.html',
  styleUrls: ['./user-modal.css']
})

export class UserModal implements OnInit {
  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  @Input() user: User | null = null;
  @Output() close = new EventEmitter<{ refresh: boolean; user?: User }>();//see

  form!: FormGroup;
  submitted = false;

  currencies = ['INR', 'AED', 'USD'];
  measurementSystems = ['Metric', 'US', 'UK'];

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    //set up with validation rules
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['',Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['',Validators.required],
      type: ['',Validators.required],
      role: ['',Validators.required],
      password: ['', this.mode === 'create' ? Validators.required : []],
      confirmPassword: ['', this.mode === 'create' ? Validators.required : []],
      userCurrency: ['INR', Validators.required],
      measurementSystem: ['Metric', Validators.required],
      userStatus: []
    });
    //fill the from in view or edit mode with previous value
    if (this.user) {
      this.form.patchValue(this.user);
    }
    //Disable form if view
    if (this.mode === 'view') {
      this.form.disable();
    }
  }

//password
password: string = '';
confirmPassword: string = '';
showPassword: boolean = false;
showConfirmPassword: boolean = false;
passwordMismatch: boolean = false;

PasswordVisibility() {
  this.showPassword = !this.showPassword;
}

ConfirmPasswordVisibility() {
  this.showConfirmPassword = !this.showConfirmPassword;
}

// Validate password format
passwordValidations = {
  hasMinLength: false,
  hasNumber: false,
  hasSpecialChar: false
};
validatePassword() {
  this.passwordValidations.hasMinLength = this.password.length >= 8;
  this.passwordValidations.hasNumber = /\d/.test(this.password);
  this.passwordValidations.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(this.password);
}

//confirm password validation

checkPasswordMatch() {
  this.passwordMismatch = this.password !== this.confirmPassword && this.confirmPassword.length > 0;
}
//submit password validation
passwardSubmitValid(): boolean {
  return (
    this.passwordValidations.hasMinLength &&
    this.passwordValidations.hasNumber &&
    this.passwordValidations.hasSpecialChar &&
    !this.passwordMismatch
  );
}

  submit() {
    this.submitted=true


    // Stop submission if form is invalid
    if (this.form.invalid || !this.passwardSubmitValid()) return;


    if (this.mode === 'view') {
      this.close.emit({ refresh: false });
      return;
    }

    if (this.form.invalid) return;

    const payload: User = this.form.value;

    if (this.mode === 'create') {
      this.userService.createUser(payload).subscribe((newUser) => {
        this.close.emit({ refresh: true, user: newUser });
      });
    } else if (this.mode === 'edit' && this.user?.id) {
      
      this.userService.updateUser(this.user.id, payload).subscribe((updatedUser) => {
        this.close.emit({ refresh: true, user: updatedUser });
      });
    }
  }
   

  //Shortcut to access form controls in template
  get f() {
    return this.form.controls;
  }

  cancel() {
    this.close.emit({ refresh: false });
  }
}
