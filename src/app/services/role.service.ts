// role.service.ts
import { Injectable, signal } from '@angular/core';

export type UserRole = 'buyer' | 'seller' | undefined;

@Injectable({
      providedIn: 'root',
})
export class RoleService {
      private role = signal<UserRole>(undefined);
      currentRole = this.role.asReadonly();

      constructor() {
            const savedRole = localStorage.getItem('app_role') as UserRole | null;
            if (savedRole) {
                  this.role.set(savedRole);
            }
      }

      setRole(role: UserRole) {
            this.role.set(role);
            localStorage.setItem('app_role', role ? role : '');
      }

      getRole(): UserRole {
            return this.role();
      }
}
