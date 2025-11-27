import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { UsuarioRequest, UsuarioResponse, UsuarioService } from '../../services/usuario-service';

@Component({
  selector: 'app-gerenciar-agentes',
  imports: [FormsModule, Navbar, CommonModule],
  templateUrl: './gerenciar-agentes.html',
  styleUrl: './gerenciar-agentes.scss',
})
export class GerenciarAgentes implements OnInit {
  busca = '';
  agentes: UsuarioResponse[] = [];
  mostrarModalAdicionar = false;
  carregando = false;
  agenteEmEdicaoId: number | null = null;

  novoAgente: UsuarioRequest = {
    nmUsuario: '',
    dsSenha: '',
    nuFuncionario: 0,
    dsEmail: '',
    flAtivo: true,
    roles: ['ROLE_AGENTE'],
  };

  constructor(private usuarioService: UsuarioService, private cdRef: ChangeDetectorRef) {}

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
      },
    });
  }

  get agentesFiltrados(): UsuarioResponse[] {
    const apenasAgentes = this.agentes.filter(
      (agente) => agente.roles && agente.roles.includes('ROLE_AGENTE')
    );

    if (!this.busca) {
      return apenasAgentes;
    }

    const termo = this.busca.toLowerCase();
    return apenasAgentes.filter(
      (agente) =>
        agente.nmUsuario?.toLowerCase().includes(termo) ||
        agente.dsEmail?.toLowerCase().includes(termo) ||
        agente.nuFuncionario?.toString().includes(termo)
    );
  }

  abrirModalAdicionar() {
    this.mostrarModalAdicionar = true;
    this.agenteEmEdicaoId = null;
    this.novoAgente = {
      nmUsuario: '',
      dsSenha: '',
      nuFuncionario: 0,
      dsEmail: '',
      flAtivo: true,
      roles: ['ROLE_AGENTE'],
    };
  }

  editarAgente(agente: UsuarioResponse) {
    this.agenteEmEdicaoId = agente.cdUsuario;
    this.mostrarModalAdicionar = true;
    this.novoAgente = {
      nmUsuario: agente.nmUsuario,
      dsSenha: '',
      nuFuncionario: agente.nuFuncionario,
      dsEmail: agente.dsEmail,
      flAtivo: agente.flAtivo,
      roles: agente.roles || ['ROLE_AGENTE'],
    };
  }

  salvarAgente() {
    if (!this.novoAgente.nmUsuario || !this.novoAgente.dsEmail) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    if (!this.agenteEmEdicaoId && !this.novoAgente.dsSenha) {
      alert('A senha é obrigatória para novos agentes.');
      return;
    }

    this.carregando = true;

    if (this.agenteEmEdicaoId) {
      const dadosAtualizacao = { ...this.novoAgente };
      if (!dadosAtualizacao.dsSenha) {
        delete (dadosAtualizacao as any).dsSenha;
      }

      this.usuarioService.atualizar(this.agenteEmEdicaoId, dadosAtualizacao).subscribe({
        next: (agenteAtualizado) => {
          const index = this.agentes.findIndex((a) => a.cdUsuario === this.agenteEmEdicaoId);
          if (index !== -1) {
            this.agentes[index] = agenteAtualizado;
          }
          this.carregando = false;
          this.fecharModal();
        },
        error: (error) => this.tratarErro(error, 'Erro ao atualizar agente'),
      });
    } else {
      this.usuarioService.cadastrar(this.novoAgente).subscribe({
        next: (agenteCadastrado) => {
          if (!agenteCadastrado.roles) {
            agenteCadastrado.roles = ['ROLE_AGENTE'];
          }
          this.agentes.push(agenteCadastrado);
          this.carregando = false;
          this.fecharModal();
        },
        error: (error) => this.tratarErro(error, 'Erro ao cadastrar agente'),
      });
    }
  }

  private tratarErro(error: any, mensagemPadrao: string) {
    console.error(mensagemPadrao, error);
    this.carregando = false;
    this.cdRef.detectChanges();
    const msg = error.error?.message || error.message || mensagemPadrao;
    alert(msg);
  }

  fecharModal() {
    this.mostrarModalAdicionar = false;
    this.agenteEmEdicaoId = null;
    this.carregando = false;
    this.cdRef.detectChanges();
  }

  desativarAgente(agente: UsuarioResponse) {
    if (confirm(`Tem certeza que deseja desativar o agente ${agente.nmUsuario}?`)) {
      this.usuarioService.desativar(agente.cdUsuario).subscribe();
      window.location.reload();
    }
  }

  reativarAgente(agente: UsuarioResponse) {
    if (confirm(`Tem certeza que deseja reativar o agente ${agente.nmUsuario}?`)) {
      this.usuarioService.reativar(agente.cdUsuario).subscribe();
      window.location.reload();
    }
  }

  excluirAgente(agente: UsuarioResponse) {}

  getIniciais(nome: string): string {
    if (!nome) return '';
    return nome
      .split(' ')
      .map((palavra) => palavra.charAt(0))
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
}
