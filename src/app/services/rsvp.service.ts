import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { throwError } from 'rxjs';

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

  // Email donde quieres recibir las confirmaciones
  private readonly DESTINATION_EMAIL = 'said25022004@gmail.com';
  
  // Formsubmit.co - Funciona inmediatamente sin configuración
  // Plan gratuito: 50 emails/mes (suficiente para la mayoría de bodas)
  // Si necesitas más, puedes actualizar a un plan de pago
  private readonly FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/' + this.DESTINATION_EMAIL;

  constructor(private http: HttpClient) { }

  submitRsvp(data: RsvpData): Observable<any> {
    // Formateamos los datos para que se vean bien en el email
    const payload = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone || 'No proporcionado',
      message: this.formatEmailMessage(data),
      _subject: `💍 Nueva confirmación de asistencia - ${data.attendance === 'yes' ? 'Sí asistirá' : 'No asistirá'}`,
      _template: 'box', // Template de Formsubmit para mejor formato
      _captcha: false, // Desactivar captcha para mejor UX
      _autoresponse: this.formatAutoResponse(data), // Email automático al invitado
    };

    console.log('Enviando RSVP a Formsubmit.co:', payload);

    return this.http.post(this.FORMSUBMIT_ENDPOINT, payload, {
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
  }

  private formatAutoResponse(data: RsvpData): string {
    if (data.attendance === 'yes') {
      return `¡Hola ${data.firstName}!\n\nGracias por confirmar tu asistencia a nuestra boda. Estamos muy emocionados de compartir este día especial contigo.\n\nNos vemos el 20 de Junio de 2026 en Sala Aljauda, Barcelona.\n\nCon cariño,\nFuad y Naoual 💍`;
    } else {
      return `¡Hola ${data.firstName}!\n\nLamentamos mucho que no puedas asistir, pero agradecemos que nos lo hayas comunicado.\n\nEsperamos verte pronto en otra ocasión.\n\nCon cariño,\nFuad y Naoual 💍`;
    }
  }

  private formatEmailMessage(data: RsvpData): string {
    let message = `NUEVA CONFIRMACIÓN DE ASISTENCIA\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `👤 INFORMACIÓN PERSONAL\n`;
    message += `Nombre completo: ${data.firstName} ${data.lastName}\n`;
    message += `Correo electrónico: ${data.email}\n`;
    message += `Teléfono: ${data.phone || 'No proporcionado'}\n\n`;
    
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `📋 CONFIRMACIÓN\n`;
    message += `Asistencia: ${data.attendance === 'yes' ? '✅ SÍ ASISTIRÁ' : '❌ NO ASISTIRÁ'}\n`;
    
    if (data.attendance === 'yes') {
      message += `Número total de personas: ${data.totalGuests}\n`;
      if (data.guestNames) {
        message += `Nombres de acompañantes: ${data.guestNames}\n`;
      }
      if ((data as any).bringingChildren) {
        message += `Trae hijos: Sí (${(data as any).numberOfChildren || 0})\n`;
      }
      if ((data as any).menuType) {
        message += `Tipo de menú: ${(data as any).menuType}\n`;
      }
      if (data.dietaryRestrictions) {
        message += `Restricciones dietéticas: ${data.dietaryRestrictions}\n`;
      }
      if (data.songRequest) {
        message += `Canción sugerida: ${data.songRequest}\n`;
      }
    }
    
    if (data.message) {
      message += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      message += `💬 MENSAJE PARA LOS NOVIOS\n`;
      message += `${data.message}\n`;
    }
    
    return message;
  }

  // Método para enviar notificación a los novios
  notifyCouple(data: RsvpData): Observable<any> {
    // En producción, esto enviaría un email a los novios con los datos del RSVP
    console.log('Notificación a novios:', data);
    return of({ success: true }).pipe(delay(500));
  }
}
