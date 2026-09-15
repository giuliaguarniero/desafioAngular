import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:3001';
  private readonly usuarioLogadoKey = 'usuarioLogado';

  constructor(private http: HttpClient) {}

  login(usuario: Pick<Usuario, 'nome' | 'senha'>): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, usuario).pipe(
      tap((usuarioAutenticado) => {
        localStorage.setItem(this.usuarioLogadoKey, JSON.stringify(usuarioAutenticado));
      })
    );
  }

  estaLogado(): boolean {
    const usuarioArmazenado = localStorage.getItem(this.usuarioLogadoKey);

    if (!usuarioArmazenado) {
      return false;
    }

    try {
      const usuario = JSON.parse(usuarioArmazenado);
      return !!usuario && typeof usuario === 'object';
    } catch {
      this.logout();
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(this.usuarioLogadoKey);
  }
}