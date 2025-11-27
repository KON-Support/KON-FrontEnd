import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OAuth2Service } from '../../services/oauth2-service';
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

    fetch('http://localhost:8089/api/usuario/cadastro', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dto)
    })
    .then(async res => {
      this.loading = false;

      
      if(res.status === 500) {
        this.cdr.detectChanges();
        this.error = 'E-mail já cadastrado.';
      }

      if (!res.ok) {
        const msg = await res.json().catch(() => ({ message: 'Erro desconhecido' }));
        this.cdr.detectChanges();
        return;
      }

      this.router.navigate(['/login']);
    })
    .catch(err => {
      this.cdr.detectChanges();
      this.loading = false;
      console.error(err);
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