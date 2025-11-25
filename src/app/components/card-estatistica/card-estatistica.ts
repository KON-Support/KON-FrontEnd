import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ChamadoService } from '../../services/chamado-service';
import { Chamado } from '../../shared/models/Chamado';
import { Status } from '../../shared/models/Status';

@Component({
  selector: 'app-card-estatistica',
  imports: [],
  templateUrl: './card-estatistica.html',
  styleUrl: './card-estatistica.scss',
})
export class CardEstatistica implements OnInit {
  private chamadoService = inject(ChamadoService);
  private cdr = inject(ChangeDetectorRef);

  protected chamados: Chamado[] = [];
  protected qtdChamados: number = 0;
  protected qtdSlaVencido: number = 0;
  protected qtdResolvidosHoje: number = 0;
  protected qtdCriticos: number = 0;

  ngOnInit(): void {
    this.chamadoService.buscarChamados().subscribe((response) => {
      this.chamados = response;
      this.qtdChamados = this.chamados.filter(
        (chamado) => chamado.status !== Status.FECHADO && chamado.status !== Status.RESOLVIDO
      ).length;
      this.qtdSlaVencido = this.chamados.filter((chamado) => chamado.flSlaViolado).length;
      this.calcularResolvidosHoje();
      this.cdr.detectChanges();
      console.log(this.qtdResolvidosHoje);
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
