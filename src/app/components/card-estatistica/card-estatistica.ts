import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ChamadoService } from '../../services/chamado-service';
import { Chamado } from '../../shared/models/Chamado';

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
  protected qtdSlaVencido = this.chamados.filter((chamado) => chamado.flSlaViolado).length;
  protected qtdResolvidosHoje: number = 0;
  protected qtdCriticos: number = 0;

  ngOnInit(): void {
    this.chamadoService.buscarChamados().subscribe((response) => {
      this.chamados = response;
      this.qtdChamados = this.chamados.length;
      this.qtdSlaVencido = this.chamados.filter((chamado) => chamado.flSlaViolado).length;
      this.cdr.detectChanges();
    });
  }
}
