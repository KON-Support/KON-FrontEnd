import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chamado } from '../../shared/models/Chamado';
import { Status } from '../../shared/models/Status';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-chamado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-chamado.html',
  styleUrl: './card-chamado.scss',
})

export class CardChamado {
  chamado = input.required<Chamado>();
  cardClick = inject(Router);

  onCardClick(): void {
    this.cardClick.navigate([`chamado/detalhes/${this.chamado().cdChamado}`]);
  }

  getStatusClass(): string {
    const statusClasses: Record<Status, string> = {
      [Status.ABERTO]: 'status-aberto',
      [Status.EM_ANDAMENTO]: 'status-andamento',
      [Status.RESOLVIDO]: 'status-resolvido',
      [Status.FECHADO]: 'status-fechado',
    };
    return statusClasses[this.chamado().status] || 'status-aberto';
  }

  getStatusLabel(): string {
    const statusLabels: Record<Status, string> = {
      [Status.ABERTO]: 'Aberto',
      [Status.EM_ANDAMENTO]: 'Em Andamento',
      [Status.RESOLVIDO]: 'Resolvido',
      [Status.FECHADO]: 'Fechado',
    };
    return statusLabels[this.chamado().status] || 'Aberto';
  }

  getStatusIcon(): string {
    const statusIcons: Record<Status, string> = {
      [Status.ABERTO]: 'bi-circle',
      [Status.EM_ANDAMENTO]: 'bi-arrow-repeat',
      [Status.RESOLVIDO]: 'bi-check-circle',
      [Status.FECHADO]: 'bi-x-circle',
    };
    return statusIcons[this.chamado().status] || 'bi-circle';
  }

  formatDate(date: Date | null): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  }

  formatTime(time: string | null): string {
    if (!time) return '';
    return time.substring(0, 5);
  }

  isSlaViolado(): boolean {
    return this.chamado().flSlaViolado;
  }

  hasAnexo(): boolean {
    return this.chamado().anexo !== null;
  }
}