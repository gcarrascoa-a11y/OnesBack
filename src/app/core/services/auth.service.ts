import { Injectable } from '@angular/core';

export type Role = 'admin' | 'user';

export interface User {
  username: string;
  role: Role;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Usuario actual (o null si no hay sesión)
  private _user: User | null = JSON.parse(localStorage.getItem('user') || 'null');

  /**
   * Login de prueba:
   *  - admin / admin -> admin
   *  - user  / user  -> user
   */
  login(username: string, password: string): boolean {
    let user: User | null = null;

    if (username === 'admin' && password === 'admin') {
      user = { username: 'admin', role: 'admin' };
    } else if (username === 'user' && password === 'user') {
      user = { username: 'user', role: 'user' };
    } else {
      return false;
    }

    this._user = user;
    localStorage.setItem('user', JSON.stringify(user));
    return true;
  }

  logout(): void {
    this._user = null;
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return this._user !== null;
  }

  currentRole(): Role | '' {
    return this._user ? this._user.role : '';
  }

  currentUsername(): string {
    return this._user ? this._user.username : '';
  }
}
