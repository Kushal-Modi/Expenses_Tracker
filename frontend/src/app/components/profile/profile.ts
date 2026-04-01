import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService, UserProfile } from '../../services/user.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');
  if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  
  profileMessage = '';
  profileError = '';
  passwordMessage = '';
  passwordError = '';

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.userService.getProfile().subscribe({
      next: (profile) => {
        this.profileForm.patchValue({
          name: profile.name || '',
          email: profile.email || ''
        });
      },
      error: (err) => console.error('Failed to load profile', err)
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) return;

    this.profileError = '';
    this.profileMessage = '';

    const data: UserProfile = this.profileForm.value;
    this.userService.updateProfile(data).subscribe({
      next: (res) => {
        this.profileMessage = 'Profile updated successfully!';
      },
      error: (err) => {
        this.profileError = err.error?.message || 'Failed to update profile.';
      }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;

    this.passwordError = '';
    this.passwordMessage = '';

    const data = {
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword
    };

    this.userService.changePassword(data).subscribe({
      next: () => {
        this.passwordMessage = 'Password changed successfully!';
        this.passwordForm.reset();
      },
      error: (err) => {
        this.passwordError = err.error || 'Failed to change password.';
      }
    });
  }
}
