import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      funcionarios: ['', [Validators.required, Validators.min(1)]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required]
    }, { validators: this.validarSenha });
  }

  validarSenha(form: FormGroup) {
    const password = form.get('senha');
    const confirmPassword = form.get('confirmarSenha');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  senhaVisivel() {
    this.showPassword = !this.showPassword;
  }

  senhaVisivelConfirmar() {
    this.showConfirmPassword = !this.showConfirmPassword;
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

      if (!res.ok) {
        const msg = await res.json().catch(() => ({ message: 'Erro desconhecido' }));
        this.error = msg.message || 'Erro ao cadastrar usuário.';
        return;
      }

      alert('Usuário cadastrado com sucesso!');
      this.router.navigate(['/login']);
    })
    .catch(err => {
      this.loading = false;
      this.error = 'Erro ao conectar ao servidor.';
      console.error(err);
    });
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
