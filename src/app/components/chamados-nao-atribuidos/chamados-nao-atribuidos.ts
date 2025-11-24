import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChamadoService } from '../../services/chamado-service';
import { Chamado } from '../../shared/models/Chamado';

@Component({
  selector: 'app-chamados-nao-atribuidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chamados-nao-atribuidos.html',
  styleUrl: './chamados-nao-atribuidos.scss',
})
export class ChamadosNaoAtribuidos implements OnInit {
  chamadosNaoAtribuidos: Chamado[] = [];

  private chamadoService = inject(ChamadoService);

  ngOnInit(): void {
    this.chamadoService.buscarChamados().subscribe((response) => {
      this.chamadosNaoAtribuidos = response.filter(
        (chamado) => !chamado.responsavel
      );
      console.log('Chamados não atribuídos carregados:', this.chamadosNaoAtribuidos);
    });
  }
}
