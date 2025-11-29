import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OAuth2Service } from '../../services/oauth2-service';
import { UsuarioService } from '../../services/usuario-service';
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.scss']
})

export class Cadastro {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  error = '';

  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private oauth2Service = inject(OAuth2Service);
  private usuarioService = inject(UsuarioService);

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      funcionarios: ['', [Validators.required, Validators.min(1)]],
      senha: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{6,}$/)]],
      confirmarSenha: ['', Validators.required]
    },
      { validators: this.validarSenha }
    );
  }

  validarSenha(form: AbstractControl) {
    const password = form.get('senha');
    const confirmPassword = form.get('confirmarSenha');

    if (password && confirmPassword) {
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPassword.setErrors(null);

      }
    }
    return null;
  }

  senhaVisivel() {
    this.showPassword = !this.showPassword;
    this.showConfirmPassword = this.showPassword;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const dto = {
      nmUsuario: this.registerForm.value.nome,
      dsEmail: this.registerForm.value.email,
      dsSenha: this.registerForm.value.senha,
      nuFuncionario: this.registerForm.value.funcionarios,
      flAtivo: true,
      roles: []
    };

    console.log('Enviando DTO:', dto);

    this.usuarioService.cadastrar(dto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();

        if (err.status === 500 || err.status === 400) {
          this.error = err.error?.message || 'E-mail já cadastrado.';
        } else {
          this.error = 'Erro ao cadastrar usuário. Tente novamente.';
        }
        console.error(err);
      }
    });
  }

  loginWithGoogle(): void {
    this.oauth2Service.loginWithGoogle();
  }

  irParaLogin() {
    this.router.navigate(['/login']);
  }

  get nome() { return this.registerForm.get('nome'); }
  get email() { return this.registerForm.get('email'); }
  get funcionarios() { return this.registerForm.get('funcionarios'); }
  get senha() { return this.registerForm.get('senha'); }
  get confirmarSenha() { return this.registerForm.get('confirmarSenha'); }
}