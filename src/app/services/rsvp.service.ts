import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, switchMap } from 'rxjs/operators';

export interface RsvpData {
  attendance: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  totalGuests: number;
  guestNames?: string;
  menuType?: string;
  dietaryRestrictions?: string;
  songRequest?: string;
  message?: string;
  privacyConsent: boolean;
  bringingChildren?: boolean;
  numberOfChildren?: number;
}

@Injectable({
  providedIn: 'root'
})
export class RsvpService {
  private readonly DESTINATION_EMAIL = 'said25022004@gmail.com';
  
  // ✅ CORREGIR: Usa esta URL del Web App (la que tienes al final)
  private readonly GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwUTzJRY0ROLlcmWmGt5qkIJ7ZeM67q-BRvytiZc8_CNP2EJ5p2__jy1e3FP5YmucAzAQ/exec';
  
  private readonly FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${this.DESTINATION_EMAIL}`;
  private mode: 'both' | 'google-only' | 'formsubmit-only' = 'both';

  constructor(private http: HttpClient) { }

  submitRsvp(data: RsvpData): Observable<any> {
    console.log(`📤 Enviando RSVP en modo: ${this.mode}`);

    switch (this.mode) {
      case 'google-only':
        return this.sendToGoogleScript(data);
      case 'formsubmit-only':
        return this.sendToFormsubmit(data);
      case 'both':
      default:
        return this.sendToBoth(data);
    }
  }

  private sendToBoth(data: RsvpData): Observable<any> {
    return this.sendToFormsubmit(data).pipe(
      catchError((formsubmitError: any) => {
        console.warn('⚠️ Formsubmit falló, intentando solo Google Script:', formsubmitError);
        return this.sendToGoogleScript(data);
      }),
      switchMap((formsubmitResponse: any) => {
        console.log('✅ Formsubmit exitoso, enviando backup a Google Script...');
        return this.sendToGoogleScript(data).pipe(
          catchError((googleError: any) => {
            console.warn('⚠️ Google Script falló, pero Formsubmit ya funcionó');
            return of(formsubmitResponse);
          })
        );
      })
    );
  }

  private sendToGoogleScript(data: RsvpData): Observable<any> {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || '',
      attendance: data.attendance,
      totalGuests: data.totalGuests,
      guestNames: data.guestNames || '',
      bringingChildren: data.bringingChildren || false,
      numberOfChildren: data.numberOfChildren || 0,
      menuType: data.menuType || '',
      dietaryRestrictions: data.dietaryRestrictions || '',
      songRequest: data.songRequest || '',
      message: data.message || '',
      privacyConsent: data.privacyConsent,
      timestamp: new Date().toISOString()
    };

    console.log('📊 Enviando a Google Script:', payload);

    const headers = new HttpHeaders({
      'Content-Type': 'text/plain;charset=utf-8'
    });

    return this.http.post(this.GOOGLE_SCRIPT_URL, JSON.stringify(payload), {
      headers,
      responseType: 'json'
    }).pipe(
      catchError((error: HttpErrorResponse) => this.handleGoogleError(error))
    );
  }

  private sendToFormsubmit(data: RsvpData): Observable<any> {
    const payload = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone || 'No proporcionado',
      message: this.formatEmailMessage(data),
      _subject: `💍 Confirmación Boda - ${data.firstName} ${data.lastName}`,
      _template: 'box',
      _captcha: 'false',
      _autoresponse: this.formatAutoResponse(data),
    };

    console.log('📧 Enviando a Formsubmit:', payload);

    return this.http.post(this.FORMSUBMIT_ENDPOINT, payload, {
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(
      catchError((error: HttpErrorResponse) => this.handleFormsubmitError(error))
    );
  }

  private handleGoogleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error con Google Script';
    if (error.status === 0) {
      errorMessage = 'Error de conexión. Verifica tu internet.';
    } else if (error.status === 403) {
      errorMessage = 'El script necesita autorización. Abre esta URL en el navegador: ' + this.GOOGLE_SCRIPT_URL;
    } else if (error.status === 404) {
      errorMessage = 'URL incorrecta del Google Script.';
    } else {
      errorMessage = `Error ${error.status}: ${error.message}`;
    }
    console.error('❌ Error Google Script:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private handleFormsubmitError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error con Formsubmit';
    if (error.status === 429) {
      errorMessage = 'Límite de Formsubmit alcanzado.';
    } else if (error.status === 403) {
      errorMessage = 'Formsubmit: Email no verificado.';
    } else if (error.status === 0) {
      errorMessage = 'Error de conexión con Formsubmit.';
    } else {
      errorMessage = `Error Formsubmit ${error.status}: ${error.message}`;
    }
    console.error('❌ Error Formsubmit:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private formatAutoResponse(data: RsvpData): string {
    const weddingDate = '20 de Junio de 2026';
    const weddingLocation = 'Sala Aljauda, Barcelona';
    
    if (data.attendance === 'yes') {
      return `¡Hola ${data.firstName}!
¡Gracias por confirmar tu asistencia a nuestra boda! 
📅 Fecha: ${weddingDate}
📍 Lugar: ${weddingLocation}
👥 Invitados confirmados: ${data.totalGuests}
Con cariño,
Fuad y Naoual 💍`;
    } else {
      return `¡Hola ${data.firstName}!
Gracias por informarnos que no podrás asistir. 
Esperamos verte pronto en otra ocasión.
Con cariño,
Fuad y Naoual 💍`;
    }
  }

  private formatEmailMessage(data: RsvpData): string {
    let message = `NUEVA CONFIRMACIÓN DE BODA\n\n`;
    message += `Nombre: ${data.firstName} ${data.lastName}\n`;
    message += `Email: ${data.email}\n`;
    message += `Teléfono: ${data.phone || 'No proporcionado'}\n`;
    message += `Asistencia: ${data.attendance === 'yes' ? '✅ SÍ' : '❌ NO'}\n`;
    
    if (data.attendance === 'yes') {
      message += `Total invitados: ${data.totalGuests}\n`;
      if (data.guestNames) message += `Acompañantes: ${data.guestNames}\n`;
      if (data.bringingChildren) message += `Trae hijos: Sí (${data.numberOfChildren})\n`;
      if (data.dietaryRestrictions) message += `Restricciones: ${data.dietaryRestrictions}\n`;
      if (data.songRequest) message += `Canción sugerida: ${data.songRequest}\n`;
    }
    
    if (data.message) message += `\nMensaje:\n${data.message}\n`;
    
    return message;
  }

  setMode(mode: 'both' | 'google-only' | 'formsubmit-only'): void {
    this.mode = mode;
  }

  getMode(): string {
    return this.mode;
  }

  notifyCouple(data: RsvpData): Observable<any> {
    console.log('📨 Notificación a novios:', data);
    return of({ success: true }).pipe(delay(300));
  }
}