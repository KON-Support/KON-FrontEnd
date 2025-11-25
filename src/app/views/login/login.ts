import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  loading = false;
  error: string | null = null;
  showPassword = false;

  constructor() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get senha() {
    return this.loginForm.get('senha');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
  if (this.loginForm.invalid) return;

  this.loading = true;
  this.error = null;

  const { email, senha } = this.loginForm.value;

  this.authService.login(email, senha).subscribe({
    next: () => {
      this.router.navigate(['/agente/dashboard']);
      this.loading = false;
    },
    error: (err) => {
      this.error = err.error?.message || 'Credenciais inválidas.';
      this.loading = false;
    },
  });
}


  loginWithGoogle(): void {
    console.log('Login com Google');
  }

  loginWithGithub(): void {
    console.log('Login com GitHub');
  }

  irParaCadastro(): void {
    this.router.navigate(['/cadastro']);
  }
}