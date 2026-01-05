import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

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
}

@Injectable({
  providedIn: 'root'
})
export class RsvpService {

  constructor() { }

  submitRsvp(data: RsvpData): Observable<any> {
    // En producción, aquí harías una llamada HTTP real a tu backend
    // Por ahora, simulamos una respuesta exitosa
    
    console.log('RSVP Data:', data);
    
    // Aquí podrías integrar con:
    // - Un servicio de email (EmailJS, SendGrid, etc.)
    // - Un backend propio
    // - Google Forms API
    // - Formspree u otro servicio de formularios
    
    // Ejemplo de integración con EmailJS (comentado):
    /*
    return this.http.post('https://api.emailjs.com/api/v1.0/email/send', {
      service_id: 'YOUR_SERVICE_ID',
      template_id: 'YOUR_TEMPLATE_ID',
      user_id: 'YOUR_USER_ID',
      template_params: {
        to_email: data.email,
        from_name: `${data.firstName} ${data.lastName}`,
        attendance: data.attendance,
        total_guests: data.totalGuests,
        message: data.message
      }
    });
    */
    
    // Simulación de respuesta exitosa
    return of({ success: true, message: 'RSVP enviado correctamente' }).pipe(
      delay(1000) // Simula latencia de red
    );
  }

  // Método para enviar notificación a los novios
  notifyCouple(data: RsvpData): Observable<any> {
    // En producción, esto enviaría un email a los novios con los datos del RSVP
    console.log('Notificación a novios:', data);
    return of({ success: true }).pipe(delay(500));
  }
}
