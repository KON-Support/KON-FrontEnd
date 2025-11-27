import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class OAuth2Service {

    private readonly BACKEND_URL = 'http://localhost:8089';

    constructor(private router: Router) { }

    loginWithGoogle(): void {
        window.location.href = `${this.BACKEND_URL}/oauth2/authorization/google`;
    }

    handleOAuth2Callback(token: string, userId: string, userName: string, userEmail: string): void {

        localStorage.setItem('token', token);

        const userData = {
            cdUsuario: parseInt(userId),
            nmUsuario: decodeURIComponent(userName),
            dsEmail: decodeURIComponent(userEmail),
            roleModel: [{ cdRole: 1, nmRole: 'ROLE_USER' }]
        };

        localStorage.setItem('user', JSON.stringify(userData));

        this.router.navigate(['/user/dashboard']);
    }

    handleOAuth2Error(error: string): void {
        console.error('Erro OAuth2:', error);
        alert('Erro ao fazer login com Google. Por favor, tente novamente.');
        this.router.navigate(['/login']);
    }
}