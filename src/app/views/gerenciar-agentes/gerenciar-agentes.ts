import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarAdmin } from "../../components/navbar-admin/navbar-admin";
import { UsuarioRequest, UsuarioResponse, UsuarioService } from '../../services/usuario-service';

@Component({
  selector: 'app-gerenciar-agentes',
  imports: [FormsModule, NavbarAdmin, CommonModule],
  templateUrl: './gerenciar-agentes.html',
  styleUrl: './gerenciar-agentes.scss',
})
export class GerenciarAgentes implements OnInit {
  busca = '';
  agentes: UsuarioResponse[] = [];
  mostrarModalAdicionar = false;
  carregando = false;
  novoAgente: UsuarioRequest = {
    nmUsuario: '',
    dsSenha: '',
    nuFuncionario: 0,
    dsEmail: '',
    flAtivo: true,
    roles: ['ROLE_AGENTE']
  };

  constructor(
    private usuarioService: UsuarioService,
    private cdRef: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.carregarAgentes();
  }

  carregarAgentes() {
    this.carregando = true;
    this.cdRef.detectChanges();
    
    this.usuarioService.buscarTodos().subscribe({
      next: (usuarios: any[]) => {
        this.agentes = usuarios || [];
        this.carregando = false;
        this.cdRef.detectChanges();
      },
      error: (error: any) => {
        console.error(' Erro:', error);
        this.carregando = false;
        this.cdRef.detectChanges();
      }
    });
  }

  get agentesFiltrados(): UsuarioResponse[] {
    const apenasAgentes = this.agentes.filter(agente => 
      agente.roles && agente.roles.includes('ROLE_AGENTE')
    );

    if (!this.busca) {
      return apenasAgentes;
    }
    
    const termo = this.busca.toLowerCase();
    return apenasAgentes.filter(agente => 
      agente.nmUsuario?.toLowerCase().includes(termo) ||
      agente.dsEmail?.toLowerCase().includes(termo) ||
      agente.nuFuncionario?.toString().includes(termo)
    );
  }

  abrirModalAdicionar() {
    this.mostrarModalAdicionar = true;
    this.novoAgente = {
      nmUsuario: '',
      dsSenha: '',
      nuFuncionario: 0,
      dsEmail: '',
      flAtivo: true,
      roles: ['ROLE_AGENTE']
    };
  }


  adicionarAgente() {
  if (!this.novoAgente.nmUsuario || !this.novoAgente.dsEmail || !this.novoAgente.dsSenha) {
    alert('Por favor, preencha todos os campos obrigatórios!');
    return;
  }

  this.carregando = true;
  
  this.usuarioService.cadastrar(this.novoAgente).subscribe({
    next: (novoAgente: any) => {
      this.agentes.push(novoAgente);
      
      this.busca = '';
      this.carregando = false;
      
      setTimeout(() => {
        this.fecharModal();
        this.cdRef.detectChanges();
      }, 100);
      
      alert('Agente cadastrado com sucesso!');
    },
    error: (error: any) => {
      console.error('Erro ao cadastrar agente:', error);
      this.carregando = false;
      this.cdRef.detectChanges();
      alert('Erro ao cadastrar agente. Tente novamente.');
    }
  });
}

fecharModal() {
  this.mostrarModalAdicionar = false;
  this.cdRef.detectChanges();
}

  desativarAgente(agente: UsuarioResponse) {
    if (confirm(`Tem certeza que deseja desativar o agente ${agente.nmUsuario}?`)) {
      this.usuarioService.desativar(agente.cdUsuario).subscribe({
        next: (agenteAtualizado: UsuarioResponse) => {
          const agenteNaLista = this.agentes.find(a => a.cdUsuario === agenteAtualizado.cdUsuario);
          if (agenteNaLista) {
            agenteNaLista.flAtivo = agenteAtualizado.flAtivo;
          }
          this.cdRef.detectChanges();
          alert('Agente desativado com sucesso!');
        },
        error: (error: any) => {
          console.error('Erro ao desativar agente:', error);
          alert('Erro ao desativar agente.');
        }
      });
    }
  }

  reativarAgente(agente: UsuarioResponse) {
    this.usuarioService.reativar(agente.cdUsuario).subscribe({
      next: (agenteAtualizado: UsuarioResponse) => {
        const agenteNaLista = this.agentes.find(a => a.cdUsuario === agenteAtualizado.cdUsuario);
        if (agenteNaLista) {
          agenteNaLista.flAtivo = agenteAtualizado.flAtivo;
        }
        this.cdRef.detectChanges();
        alert('Agente reativado com sucesso!');
      },
      error: (error: any) => {
        console.error('Erro ao reativar agente:', error);
        alert('Erro ao reativar agente.');
      }
    });
  }

  excluirAgente(agente: UsuarioResponse) {
  
  }

  getIniciais(nome: string): string {
    if (!nome) return '';
    return nome
      .split(' ')
      .map(palavra => palavra.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getStatusText(flAtivo: boolean): string {
    return flAtivo ? 'Ativo' : 'Inativo';
  }

  getStatusClass(flAtivo: boolean): string {
    return flAtivo ? 'bg-success' : 'bg-danger';
  }

  editarAgente(agente: UsuarioResponse) {
    console.log('Editar agente:', agente);
    alert('Fazer');
  }

 
}