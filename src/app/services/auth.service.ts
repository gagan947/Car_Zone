import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
      constructor(private router: Router) { }

      setValues(token: string, userInfo: any) {
            localStorage.setItem('CarZoneToken', token)
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
      }

      getToken() {
            return localStorage.getItem('CarZoneToken');
      };

      getUserInfo() {
            return JSON.parse(localStorage.getItem('userInfo') || '{}');
      }

      isLogedIn() {
            return this.getToken() !== null
      }

      logout(): void {
            localStorage.removeItem('app_role');
            localStorage.removeItem('CarZoneToken');
            localStorage.removeItem('userInfo');
      };
}