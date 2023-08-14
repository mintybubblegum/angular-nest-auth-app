import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environments';

import { AuthStatus, CheckTokenResponse, LoginResponse, User } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject( HttpClient ); //instancia para hacer peticiones HTTP

  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>( AuthStatus.checking );

  //! Al mundo exterior - para que nadie fuera del servicio pueda cambiarlo
  public currentUser = computed( () => this._currentUser() );
  public authStatus = computed( () => this._authStatus() );


  constructor() { 
    this.checkAuthStatus().subscribe();
  }

  // se actualiza el _currentUser con el usuario obtenido de la respuesta, se establece el estado de autenticación en _authStatus y se guarda el token en el almacenamiento local.
  private setAuthentication(user: User, token: string): boolean{
    
    this._currentUser.set( user );
    this._authStatus.set( AuthStatus.authenticated );
    localStorage.setItem('token', token);       
  
    return true;
  }


  //Este método toma un correo electrónico (email) y contraseña (password) como parámetros y devuelve un observable que emite un valor booleano indicando si el inicio de sesión fue exitoso.
  login( email: string, password: string ): Observable<boolean> {

    const url = `${ this.baseUrl }/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>( url, body )
      .pipe(
        map( ({ user, token }) => this.setAuthentication( user, token )),
        catchError( err => throwError( () => err.error.message )
        )  
      );
  }

  checkAuthStatus():Observable<boolean> {

    const url   = `${ this.baseUrl }/auth/check-token`;
    const token = localStorage.getItem('token');

    if ( !token ) return of(false);

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${ token }`);

      return this.http.get<CheckTokenResponse>(url, { headers })
        .pipe(
          map( ({ user, token }) => this.setAuthentication( user, token )),
          catchError(() => {
            this._authStatus.set( AuthStatus.notAuththenticated );
            return of(false);
          })
        );
  }
}
