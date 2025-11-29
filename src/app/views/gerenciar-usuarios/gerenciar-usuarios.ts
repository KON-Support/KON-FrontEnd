import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { UsuarioRequest, UsuarioResponse, UsuarioService } from '../../services/usuario-service';
import { Plano } from '../../shared/models/Plano';
import { PlanoService } from '../../services/plano-service';

@Component({
  selector: 'app-gerenciar-usuarios',
  imports: [FormsModule, Navbar, CommonModule],
  templateUrl: './gerenciar-usuarios.html',
  styleUrl: './gerenciar-usuarios.scss',
})

export class GerenciarUsuarios implements OnInit {
  busca = '';
  usuarios: UsuarioResponse[] = [];
  planos: Plano[] = [];
  mostrarModalAdicionar = false;
  carregando = false;
  usuarioEmEdicaoId: number | null = null;

  novoUsuario: UsuarioRequest = {
    nmUsuario: '',
    dsSenha: '',
    nuFuncionario: 0,
    dsEmail: '',
    flAtivo: true,
    roles: ['ROLE_USER'],
  };

  constructor(
    private usuarioService: UsuarioService,
    private planoService: PlanoService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.carregarUsuarios();
    this.carregarPlanos();
  }

  carregarUsuarios() {
    this.carregando = true;
    this.cdRef.detectChanges();

    this.usuarioService.buscarTodos().subscribe({
      next: (usuarios: any[]) => {
        this.usuarios = usuarios || [];
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

  carregarPlanos() {
    this.planoService.buscarTodos().subscribe({
      next: (planos: Plano[]) => {
        this.planos = planos || [];
        this.cdRef.detectChanges();
        console.log('Planos carregados:', this.planos);
      },
      error: (error: any) => {
        console.error(' Erro ao carregar planos:', error);
        this.cdRef.detectChanges();
      },
    });
  }

  get usuariosFiltrados(): UsuarioResponse[] {
    const apenasUsuarios = this.usuarios.filter(
      (usuario) => usuario.roles && usuario.roles.includes('ROLE_USER')
    );

    if (!this.busca) {
      return apenasUsuarios;
    }

    const termo = this.busca.toLowerCase();
    return apenasUsuarios.filter(
      (usuario) =>
        usuario.nmUsuario?.toLowerCase().includes(termo) ||
        usuario.dsEmail?.toLowerCase().includes(termo) ||
        usuario.nuFuncionario?.toString().includes(termo)
    );
  }

  abrirModalAdicionar() {
    this.mostrarModalAdicionar = true;
    this.usuarioEmEdicaoId = null;
    this.novoUsuario = {
      nmUsuario: '',
      dsSenha: '',
      nuFuncionario: 0,
      dsEmail: '',
      flAtivo: true,
      roles: ['ROLE_USER'],
    };
  }

  editarUsuario(usuario: UsuarioResponse) {
    this.usuarioEmEdicaoId = usuario.cdUsuario;
    this.mostrarModalAdicionar = true;
    this.novoUsuario = {
      nmUsuario: usuario.nmUsuario,
      dsSenha: '',
      nuFuncionario: usuario.nuFuncionario,
      dsEmail: usuario.dsEmail,
      flAtivo: usuario.flAtivo,
      roles: usuario.roles || ['ROLE_USER'],
    };
  }

  salvarUsuario() {
    if (!this.novoUsuario.nmUsuario || !this.novoUsuario.dsEmail) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    if (!this.usuarioEmEdicaoId && !this.novoUsuario.dsSenha) {
      alert('A senha é obrigatória para novos usuários.');
      return;
    }

    this.carregando = true;

    if (this.usuarioEmEdicaoId) {
      const dadosAtualizacao = { ...this.novoUsuario };
      if (!dadosAtualizacao.dsSenha) {
        delete (dadosAtualizacao as any).dsSenha;
      }

      this.usuarioService.atualizar(this.usuarioEmEdicaoId, dadosAtualizacao).subscribe({
        next: (usuarioAtualizado) => {
          const index = this.usuarios.findIndex((u) => u.cdUsuario === this.usuarioEmEdicaoId);
          if (index !== -1) {
            this.usuarios[index] = usuarioAtualizado;
          }
          this.carregando = false;
          this.fecharModal();
        },
        error: (error) => {
          this.tratarErro(error, 'Erro ao atualizar usuário');
          this.fecharModal();
        },
      });
    } else {
      this.usuarioService.cadastrar(this.novoUsuario).subscribe({
        next: (usuarioCadastrado) => {
          if (!usuarioCadastrado.roles) {
            usuarioCadastrado.roles = ['ROLE_USER'];
          }
          this.usuarios.push(usuarioCadastrado);
          this.carregando = false;
          this.fecharModal();
        },
        error: (error) => this.tratarErro(error, 'Erro ao cadastrar usuário'),
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
    this.usuarioEmEdicaoId = null;
    this.carregando = false;
    this.cdRef.detectChanges();
  }

  desativarUsuario(usuario: UsuarioResponse) {
    if (confirm(`Tem certeza que deseja desativar o usuário ${usuario.nmUsuario}?`)) {
      this.usuarioService.desativar(usuario.cdUsuario).subscribe();
      window.location.reload();
    }
  }

  reativarUsuario(usuario: UsuarioResponse) {
    if (confirm(`Tem certeza que deseja reativar o usuário ${usuario.nmUsuario}?`)) {
      this.usuarioService.reativar(usuario.cdUsuario).subscribe();
      window.location.reload();
    }
  }

  excluirUsuario(usuario: UsuarioResponse) {
    if (confirm(`Tem certeza que deseja excluir o usuário ${usuario.nmUsuario}? Esta ação é irreversível.`)) {
      this.usuarioService.excluir(usuario.cdUsuario).subscribe();
      window.location.reload();
    }
  }

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
