import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, switchMap } from 'rxjs/operators';
import emailjs from '@emailjs/browser';

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
  
  // EmailJS Configuration
  // ⚠️ IMPORTANTE: Configura tu template en EmailJS con estas variables:
  // - {{to_email}} o {{to_name}} (destinatario: said25022004@gmail.com)
  // - {{from_name}} (nombre del invitado)
  // - {{from_email}} (email del invitado)
  // - {{subject}} (asunto del email)
  // - {{message}} (mensaje completo con todos los datos)
  // - {{reply_to}} (email para responder)
  private readonly EMAILJS_PUBLIC_KEY = '-7C68t79wbzSpGIQ8';
  private readonly EMAILJS_SERVICE_ID = 'service_wzrp0vj'; // También mencionaste: service_n0cmfoe
  private readonly EMAILJS_TEMPLATE_ID = '__ejs-test-mail-service__'; // ⚠️ CAMBIA ESTE ID por el ID real de tu template en EmailJS
  
  private mode: 'both' | 'google-only' | 'emailjs-only' = 'both'; // Envía email con EmailJS y guarda en Excel con Google Script

  constructor(private http: HttpClient) {
    // EmailJS se inicializa automáticamente al usar send()
  }

  submitRsvp(data: RsvpData): Observable<any> {
    console.log(`📤 Enviando RSVP en modo: ${this.mode}`);

    switch (this.mode) {
      case 'google-only':
        return this.sendToGoogleScript(data);
      case 'emailjs-only':
        return this.sendToEmailJS(data);
      case 'both':
      default:
        return this.sendToBoth(data);
    }
  }

  private sendToBoth(data: RsvpData): Observable<any> {
    // Primero envía el email con EmailJS
    return this.sendToEmailJS(data).pipe(
      switchMap((emailjsResponse: any) => {
        console.log('✅ EmailJS exitoso, guardando en Excel con Google Script...');
        // Luego guarda en Excel con Google Script
        return this.sendToGoogleScript(data).pipe(
          catchError((googleError: any) => {
            // Si Google Script falla, aún así retornamos éxito porque el email ya se envió
            console.warn('⚠️ Google Script falló al guardar en Excel, pero el email ya se envió correctamente');
            return of({ 
              success: true, 
              emailSent: true, 
              excelSaved: false,
              emailjsResponse: emailjsResponse,
              error: 'No se pudo guardar en Excel, pero el email se envió correctamente'
            });
          }),
          switchMap((googleResponse: any) => {
            // Ambos exitosos
            return of({
              success: true,
              emailSent: true,
              excelSaved: true,
              emailjsResponse: emailjsResponse,
              googleResponse: googleResponse
            });
          })
        );
      }),
      catchError((emailjsError: any) => {
        // Si EmailJS falla, intenta al menos guardar en Excel
        console.warn('⚠️ EmailJS falló, intentando guardar al menos en Excel:', emailjsError);
        return this.sendToGoogleScript(data).pipe(
          catchError((googleError: any) => {
            // Ambos fallaron
            console.error('❌ Ambos servicios fallaron');
            return throwError(() => new Error('No se pudo enviar el email ni guardar en Excel. Por favor, inténtalo de nuevo.'));
          }),
          switchMap((googleResponse: any) => {
            // Google Script funcionó pero EmailJS falló
            return of({
              success: true,
              emailSent: false,
              excelSaved: true,
              googleResponse: googleResponse,
              warning: 'Se guardó en Excel pero no se pudo enviar el email'
            });
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

  private sendToEmailJS(data: RsvpData): Observable<any> {
    // Parámetros del template - asegúrate de que coincidan con las variables en tu template de EmailJS
    const templateParams: Record<string, string> = {
      to_email: this.DESTINATION_EMAIL,
      to_name: 'Said', // Nombre del destinatario
      from_name: `${data.firstName} ${data.lastName}`,
      from_email: data.email,
      reply_to: data.email,
      subject: `💍 Confirmación Boda - ${data.firstName} ${data.lastName}`,
      message: this.formatEmailMessage(data),
      // Campos adicionales para el template
      attendance: data.attendance === 'yes' ? '✅ SÍ' : '❌ NO',
      total_guests: data.totalGuests.toString(),
      guest_names: data.guestNames || 'N/A',
      bringing_children: data.bringingChildren ? 'Sí' : 'No',
      number_of_children: (data.numberOfChildren || 0).toString(),
      menu_type: data.menuType || 'N/A',
      dietary_restrictions: data.dietaryRestrictions || 'Ninguna',
      song_request: data.songRequest || 'Ninguna',
      personal_message: data.message || 'Ninguno',
      phone: data.phone || 'No proporcionado',
      // Auto-respuesta para el invitado (si tu template lo soporta)
      auto_response: this.formatAutoResponse(data)
    };

    console.log('📧 Enviando a EmailJS:');
    console.log('  Service ID:', this.EMAILJS_SERVICE_ID);
    console.log('  Template ID:', this.EMAILJS_TEMPLATE_ID);
    console.log('  Public Key:', this.EMAILJS_PUBLIC_KEY);
    console.log('  Template Params:', templateParams);

    return new Observable(observer => {
      emailjs.send(
        this.EMAILJS_SERVICE_ID,
        this.EMAILJS_TEMPLATE_ID,
        templateParams,
        {
          publicKey: this.EMAILJS_PUBLIC_KEY
        }
      )
      .then((response) => {
        console.log('✅ EmailJS enviado exitosamente:', response);
        console.log('  Status:', response.status);
        console.log('  Text:', response.text);
        observer.next({ success: true, status: response.status, text: response.text });
        observer.complete();
      })
      .catch((error) => {
        console.error('❌ Error EmailJS completo:', error);
        console.error('  Status:', error.status);
        console.error('  Text:', error.text);
        console.error('  Message:', error.message);
        observer.error(this.handleEmailJSError(error));
      });
    });
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

  private handleEmailJSError(error: any): Error {
    let errorMessage = 'Error con EmailJS';
    
    // Log completo del error para debugging
    console.error('🔍 Detalles del error EmailJS:', {
      status: error.status,
      statusText: error.statusText,
      text: error.text,
      message: error.message,
      error: error
    });
    
    if (error.status === 0 || error.status === 400) {
      errorMessage = 'Error de configuración de EmailJS. Verifica las credenciales (Service ID, Template ID, Public Key).';
    } else if (error.status === 401) {
      errorMessage = 'EmailJS: Clave pública inválida. Verifica tu Public Key.';
    } else if (error.status === 404) {
      errorMessage = `EmailJS: Service ID (${this.EMAILJS_SERVICE_ID}) o Template ID (${this.EMAILJS_TEMPLATE_ID}) no encontrado. Verifica que existan en tu cuenta de EmailJS.`;
    } else if (error.status === 429) {
      errorMessage = 'EmailJS: Límite de envíos alcanzado.';
    } else {
      const errorText = error.text || error.message || 'Error desconocido';
      errorMessage = `Error EmailJS ${error.status || 'desconocido'}: ${errorText}`;
    }
    
    console.error('❌ Error EmailJS procesado:', errorMessage);
    return new Error(errorMessage);
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

  setMode(mode: 'both' | 'google-only' | 'emailjs-only'): void {
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