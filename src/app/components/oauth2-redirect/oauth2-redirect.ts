import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
          params['userEmail']
        );
      } else {
        this.message = 'Parâmetros inválidos';
        this.oauth2Service.handleOAuth2Error('Parâmetros de autenticação ausentes');
      }
    });
  }
}