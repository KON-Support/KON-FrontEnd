import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChamadoService } from '../../services/chamado-service';
import { AuthService } from '../../services/auth-service';
import { Chamado } from '../../shared/models/Chamado';
import { CardChamado } from '../card-chamado/card-chamado';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-chamados-nao-atribuidos',
  standalone: true,
  imports: [CommonModule, FormsModule, CardChamado],
  templateUrl: './chamados-nao-atribuidos.html',
  styleUrl: './chamados-nao-atribuidos.scss',
})
export class ChamadosNaoAtribuidos implements OnInit {
  private chamadoService = inject(ChamadoService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  protected chamadosNaoAtribuidos = signal<Chamado[]>([]);
  protected loading = signal(true);
  
  protected filtroBusca: string = '';
  protected filtroStatus: string = '';

  ngOnInit(): void {
    this.carregarChamadosNaoAtribuidos();
  }

  private carregarChamadosNaoAtribuidos(): void {
    this.loading.set(true);

    const user = this.authService.currentUser();
    if (!user) {
      this.loading.set(false);
      return;
    }

    let chamadosObservable: Observable<Chamado[]>;

    if (this.authService.isAdmin() || this.authService.isAgente()) {
      // ADMIN e AGENTE: podem ver chamados não atribuídos
      chamadosObservable = this.chamadoService.buscarNaoAtribuidos();
    } else {
      // USER: não tem acesso
      chamadosObservable = of([]);
    }

    chamadosObservable.pipe(
      catchError((err) => {
        // Se for 403, significa que não tem permissão - retorna array vazio
        if (err.status === 403) {
          return of([]);
        }
        throw err;
      })
    ).subscribe({
      next: (response) => {
        this.chamadosNaoAtribuidos.set(response);
        this.loading.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar chamados não atribuídos:', err);
        this.chamadosNaoAtribuidos.set([]);
        this.loading.set(false);
        this.cdr.detectChanges();
      },
    });
  }

  get chamadosFiltrados(): Chamado[] {
    let chamados = this.chamadosNaoAtribuidos();

    if (this.filtroBusca) {
      const busca = this.filtroBusca.toLowerCase();
      chamados = chamados.filter(
        (chamado) =>
          chamado.dsTitulo.toLowerCase().includes(busca) ||
          chamado.dsDescricao.toLowerCase().includes(busca) ||
          chamado.cdChamado.toString().includes(busca)
      );
    }

    if (this.filtroStatus) {
      chamados = chamados.filter((chamado) => chamado.status === this.filtroStatus);
    }

    return chamados;
  }

  onChamadoClick(chamado: Chamado): void {
    this.router.navigate(['/chamados', chamado.cdChamado]);
  }
}
