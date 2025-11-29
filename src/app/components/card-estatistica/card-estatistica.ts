import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ChamadoService } from '../../services/chamado-service';
import { AuthService } from '../../services/auth-service';
import { Chamado } from '../../shared/models/Chamado';
import { Status } from '../../shared/models/Status';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-card-estatistica',
  imports: [],
  templateUrl: './card-estatistica.html',
  styleUrl: './card-estatistica.scss',
})

export class CardEstatistica implements OnInit {
  private chamadoService = inject(ChamadoService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  protected chamados: Chamado[] = [];
  protected qtdChamados: number = 0;
  protected qtdSlaVencido: number = 0;
  protected qtdResolvidosHoje: number = 0;
  protected qtdCriticos: number = 0;

  ngOnInit(): void {
    this.carregarChamados();
  }

  private carregarChamados(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    let chamadosObservable: Observable<Chamado[]>;

    if (this.authService.isAdmin()) {
      chamadosObservable = this.chamadoService.buscarChamados();
    } else if (this.authService.isAgente()) {
      chamadosObservable = this.chamadoService.buscarPorResponsavel(user.cdUsuario).pipe(
        catchError(() => of([]))
      );
    } else {
      chamadosObservable = this.chamadoService.buscarPorSolicitante(user.cdUsuario);
    }

    chamadosObservable.subscribe({
      next: (response) => {
        this.chamados = response;
        this.qtdChamados = this.chamados.filter(
          (chamado) => chamado.status !== Status.FECHADO && chamado.status !== Status.RESOLVIDO
        ).length;
        this.qtdSlaVencido = this.chamados.filter((chamado) => chamado.flSlaViolado).length;
        this.calcularResolvidosHoje();
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status !== 403) {
          console.error('Erro ao carregar estatísticas:', err);
        }
      }
    });
  }

  calcularResolvidosHoje() {
    const hoje = new Date();
    this.qtdResolvidosHoje = this.chamados.filter((chamado) => {
      if (
        (chamado.status === Status.RESOLVIDO || chamado.status === Status.FECHADO) &&
        chamado.dtFechamento
      ) {
        const dataFechamento = new Date(chamado.dtFechamento);
        return (
          dataFechamento.getDate() === hoje.getDate() &&
          dataFechamento.getMonth() === hoje.getMonth() &&
          dataFechamento.getFullYear() === hoje.getFullYear()
        );
      }
      return false;
    }).length;
  }
}
