import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OAuth2Service } from '../../services/oauth2-service';

@Component({
    selector: 'app-oauth2-redirect',
    standalone: true,
    imports: [CommonModule],
    templateUrl: 'oauth2-redirect.html',
    styleUrls: ['oauth2-redirect.scss'],
})

export class OAuth2RedirectComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private oauth2Service = inject(OAuth2Service);

    message = 'Processando autenticação...';

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            if (params['error']) {
                this.message = 'Erro ao autenticar';
                this.oauth2Service.handleOAuth2Error(params['error']);
            } else if (params['token']) {
                this.message = 'Autenticação bem-sucedida! Redirecionando...';
                this.oauth2Service.handleOAuth2Callback(
                    params['token'],
                    params['userId'],
                    params['userName'],
                    params['userEmail'],
                    params['userRoles'] || ''
                );
            } else if (params['tempEmail'] && params['tempName']) {
                this.message = 'Complete seu cadastro para continuar...';
                localStorage.setItem('tempUserEmail', decodeURIComponent(params['tempEmail']));
                localStorage.setItem('tempUserName', decodeURIComponent(params['tempName']));
                this.router.navigate(['/completar-cadastro']);
            } else {
                this.message = 'Parâmetros inválidos';
                this.oauth2Service.handleOAuth2Error('Parâmetros de autenticação ausentes');
            }
        });
    }
}