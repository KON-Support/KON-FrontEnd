import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  protected readonly title = signal('Projeto-KONSupport');
  private router = inject(Router);

  get showMainContent(): boolean {
    const url = this.router.url || '';
    return !(url.startsWith('/login') || url.startsWith('/cadastro'));
  }
}
