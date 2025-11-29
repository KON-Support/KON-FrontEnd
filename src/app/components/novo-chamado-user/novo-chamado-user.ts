import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ChamadoService } from '../../services/chamado-service';
import { CategoriaService } from '../../services/categoria-service';
import { AuthService } from '../../services/auth-service';
import { Categoria } from '../../shared/models/Categoria';
import { Status } from '../../shared/models/Status';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-novo-chamado-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Navbar],
  templateUrl: './novo-chamado-user.html',
  styleUrls: ['./novo-chamado-user.scss'],
})

export class NovoChamadoUser implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private chamadoService = inject(ChamadoService);
  private categoriaService = inject(CategoriaService);
  private authService = inject(AuthService);

  protected form!: FormGroup;
  protected categorias = signal<Categoria[]>([]);
  protected loading = signal(false);
  protected loadingCategorias = signal(true);
  protected errorMessage = signal<string | null>(null);
  protected successMessage = signal<string | null>(null);

  protected arquivoSelecionado: File | null = null;
  protected usuarioLogadoId: number = 0;

  ngOnInit(): void {
    this.obterUsuarioLogado();
    this.initForm();
    this.carregarCategorias();
  }

  private obterUsuarioLogado(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.usuarioLogadoId = user.cdUsuario;
      console.log('Usuário logado ID:', this.usuarioLogadoId);
    } else {
      this.errorMessage.set('Erro ao identificar usuário. Faça login novamente.');
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      dsTitulo: ['', [Validators.required, Validators.maxLength(30)]],
      dsDescricao: ['', [Validators.required, Validators.maxLength(300)]],
      cdCategoria: [null, [Validators.required]],
    });
  }

  private carregarCategorias(): void {
    console.log('Iniciando carregamento de categorias...');
    this.loadingCategorias.set(true);

    this.categoriaService.listarCategoriasAtivas().subscribe({
      next: (response) => {
        console.log('Categorias recebidas:', response);
        console.log('Total de categorias:', response.length);

        if (response && response.length > 0) {
          this.categorias.set(response);
          console.log('Categorias armazenadas no signal:', this.categorias());
        } else {
          console.warn('Nenhuma categoria ativa encontrada');
          this.errorMessage.set('Nenhuma categoria ativa encontrada.');
        }

        this.loadingCategorias.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
        console.error('Detalhes do erro:', JSON.stringify(err, null, 2));
        this.errorMessage.set('Erro ao carregar categorias.');
        this.loadingCategorias.set(false);
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.arquivoSelecionado = input.files[0];
      console.log('📎 Arquivo selecionado:', this.arquivoSelecionado.name);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.usuarioLogadoId) {
      this.errorMessage.set('Erro ao identificar usuário. Faça login novamente.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const payload = {
      ...this.form.value,
      status: Status.ABERTO,
      solicitante: this.usuarioLogadoId,
      cdPlano: 1,
      anexo: this.arquivoSelecionado,
    };

    this.chamadoService.abrirChamado(payload).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.successMessage.set('Chamado criado com sucesso!');
        setTimeout(() => {
          this.router.navigate(['/user/meus-chamados']);
        }, 1500);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Erro ao criar chamado. Tente novamente.');
      },
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }

  getFieldError(field: string): string {
    const control = this.form.get(field);
    if (control?.errors) {
      if (control.errors['required']) return 'Este campo é obrigatório';
      if (control.errors['maxlength']) {
        const max = control.errors['maxlength'].requiredLength;
        return `Máximo de ${max} caracteres`;
      }
    }
    return '';
  }

  get caracteresRestantesTitulo(): number {
    return 30 - (this.form.get('dsTitulo')?.value?.length || 0);
  }

  get caracteresRestantesDescricao(): number {
    return 300 - (this.form.get('dsDescricao')?.value?.length || 0);
  }

  protected formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
