import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OAuth2Service } from '../../services/oauth2-service';

@Component({
    selector: 'app-completar-cadastro',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: 'completar-cadastro.html',
    styleUrls: ['completar-cadastro.scss'],
})

export class CompletarCadastro implements OnInit {
    private fb = inject(FormBuilder);
    private oauth2Service = inject(OAuth2Service);

    formulario!: FormGroup;
    enviando = false;
    erro: string | null = null;
    sucesso = false;

    userData = {
        nome: '',
        email: ''
    };

    ngOnInit(): void {
        this.inicializarFormulario();
        this.carregarDadosTemporarios();
    }

    inicializarFormulario(): void {
        this.formulario = this.fb.group({
            nuFuncionario: [
                '',
                [
                    Validators.required,
                    Validators.pattern(/^\d+$/),
                    Validators.min(1),
                    Validators.max(10000000)
                ]
            ]
        });
    }

    carregarDadosTemporarios(): void {
        const tempUserName = localStorage.getItem('tempUserName');
        const tempUserEmail = localStorage.getItem('tempUserEmail');

        if (tempUserName) {
            this.userData.nome = tempUserName;
        }
        if (tempUserEmail) {
            this.userData.email = tempUserEmail;
        }

        if (!tempUserName || !tempUserEmail) {
            this.oauth2Service.logout();
        }
    }

    submeter(): void {
        if (this.formulario.valid) {
            this.enviando = true;
            this.erro = null;

            const nuFuncionario = this.formulario.get('nuFuncionario')?.value;
            const nome = this.userData.nome;
            const email = this.userData.email;

            this.oauth2Service.completarCadastroOAuth(nome, email, nuFuncionario).subscribe(
                (response: any) => {
                    this.enviando = false;
                    this.sucesso = true;

                    const token = response.token;
                    const usuario = response.usuario;

                    if (token && usuario) {
                        localStorage.setItem('token', token);

                        const rolesArray = usuario.roles || [];
                        const rolesString = rolesArray.join(',');

                        setTimeout(() => {
                            this.oauth2Service.finalizarLogin(
                                usuario.cdUsuario.toString(),
                                usuario.nmUsuario,
                                usuario.dsEmail,
                                rolesString
                            );
                        }, 1500);
                    } else {
                        this.erro = 'Resposta inválida do servidor';
                    }
                },
                (error: any) => {
                    this.enviando = false;
                    this.erro = error.error?.message || error.message || 'Erro ao completar cadastro. Tente novamente.';
                    console.error('Erro ao completar cadastro:', error);
                }
            );
        }
    }

    apenasNumeros(event: any): void {
        const input = event.target;
        input.value = input.value.replace(/[^\d]/g, '');

        if (input.value.length > 8) {
            input.value = input.value.substring(0, 8);
        }

        this.formulario.patchValue({
            nuFuncionario: input.value
        });
    }

    getErrorMessage(fieldName: string): string {
        const field = this.formulario.get(fieldName);
        if (field?.errors && field.touched) {
            if (field.errors['required']) return 'Campo obrigatório';
            if (field.errors['pattern']) return 'Apenas números são permitidos';
            if (field.errors['min']) return 'Mínimo de 1 funcionário';
            if (field.errors['max']) return 'Máximo de 10.000.000 funcionários';
        }
        return '';
    }
}