import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  // Endpoint de Formspree (configurado para enviar a tu email)
  private readonly FORMSPREE_ENDPOINT = 'https://formspree.io/f/xbdlvenq';

  constructor(private http: HttpClient) { }

  submitRsvp(data: RsvpData): Observable<any> {
    // Mapeamos los datos del formulario Angular al formato que recibirá Formspree
    // Formspree enviará el correo a la dirección configurada en su panel
    const payload = {
      // Campos principales que verás en el email
      nombre_completo: `${data.firstName} ${data.lastName}`,
      correo_invitado: data.email,
      telefono: data.phone ?? '',
      asistencia: data.attendance === 'yes' ? 'Sí' : 'No',
      numero_personas: data.totalGuests,
      nombres_acompanantes: data.guestNames ?? '',
      tipo_menu: (data as any).menuType ?? '',
      restricciones_dieteticas: data.dietaryRestrictions ?? '',
      cancion_sugerida: data.songRequest ?? '',
      mensaje_para_los_novios: data.message ?? '',

      // Campo especial que Formspree suele usar como "from"
      email: data.email,
      _subject: 'Nueva confirmación de asistencia (RSVP)',
    };

    console.log('Enviando RSVP a Formspree:', payload);

    return this.http.post(this.FORMSPREE_ENDPOINT, payload, {
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
  }

  // Método para enviar notificación a los novios
  notifyCouple(data: RsvpData): Observable<any> {
    // En producción, esto enviaría un email a los novios con los datos del RSVP
    console.log('Notificación a novios:', data);
    return of({ success: true }).pipe(delay(500));
  }
}
