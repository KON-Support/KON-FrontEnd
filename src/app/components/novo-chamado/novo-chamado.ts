import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ChamadoService } from '../../services/chamado-service';
import { CategoriaService } from '../../services/categoria-service';
import { Categoria } from '../../shared/models/Categoria';
import { Status } from '../../shared/models/Status';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-novo-chamado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Navbar],
  templateUrl: './novo-chamado.html',
  styleUrl: './novo-chamado.scss',
})

export class NovoChamado implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private chamadoService = inject(ChamadoService);
  private categoriaService = inject(CategoriaService);

  protected form!: FormGroup;
  protected categorias = signal<Categoria[]>([]);
  protected loading = signal(false);
  protected loadingCategorias = signal(true);
  protected errorMessage = signal<string | null>(null);
  protected successMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.initForm();
    this.carregarCategorias();
  }

  private initForm(): void {
    this.form = this.fb.group({
      dsTitulo: ['', [Validators.required, Validators.maxLength(30)]],
      dsDescricao: ['', [Validators.required, Validators.maxLength(300)]],
      cdCategoria: [null, [Validators.required]],
      solicitante: [null, [Validators.required]],
      responsavel: [null],
    });
  }

  private carregarCategorias(): void {
    console.log('🔍 Iniciando carregamento de categorias...');
    this.loadingCategorias.set(true);

    this.categoriaService.listarCategoriasAtivas().subscribe({
      next: (response) => {
        console.log('✅ Categorias recebidas:', response);
        console.log('📊 Total de categorias:', response.length);

        if (response && response.length > 0) {
          this.categorias.set(response);
          console.log('💾 Categorias armazenadas no signal:', this.categorias());
        } else {
          console.warn('⚠️ Nenhuma categoria ativa encontrada');
          this.errorMessage.set('Nenhuma categoria ativa encontrada. Por favor, cadastre categorias primeiro.');
        }

        this.loadingCategorias.set(false);
      },
      error: (err) => {
        console.error('❌ Erro ao carregar categorias:', err);
        console.error('Detalhes do erro:', JSON.stringify(err, null, 2));
        this.errorMessage.set('Erro ao carregar categorias. Verifique se o backend está rodando.');
        this.loadingCategorias.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const solicitanteId = this.form.value.solicitante;

    const payload = {
      ...this.form.value,
      status: Status.ABERTO,
      cdPlano: 1,
    };

    this.chamadoService.abrirChamado(payload).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.successMessage.set('Chamado criado com sucesso!');
        setTimeout(() => {
          this.router.navigate(['/chamados']);
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
}