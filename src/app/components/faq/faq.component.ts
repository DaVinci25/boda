import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Faq {
  question: string;
  answer: string;
  open: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {
  faqs: Faq[] = [
    {
      question: '¿Hasta cuándo puedo confirmar mi asistencia?',
      answer: 'Por favor, confirma tu asistencia antes del <strong>1 de Febrero de 2026</strong>. Esto nos ayudará a organizar mejor el evento y asegurar que todo esté perfecto para el día de la boda.',
      open: false
    },
    {
      question: '¿Se pueden llevar niños?',
      answer: '¡Por supuesto! Los niños son bienvenidos en nuestra boda. Por favor, indícanos en el formulario de confirmación cuántos niños asistirán.',
      open: false
    },
    {
      question: '¿Cuál es el dress code?',
      answer: 'El dress code es <strong>elegante / semi-formal</strong>. Para hombres: traje o chaqueta y pantalón elegante. Para mujeres: vestido largo o corto elegante.',
      open: false
    },
   
    {
      question: '¿Puedo sugerir una canción para la fiesta?',
      answer: '¡Por supuesto! Nos encantaría escuchar tus sugerencias. Puedes indicarnos tu canción favorita en el formulario de confirmación. Haremos nuestro mejor esfuerzo para incluirla en la lista de reproducción de la fiesta.',
      open: false
    },
    {
      question: '¿Qué pasa si no puedo asistir?',
      answer: 'Entendemos que a veces surgen imprevistos. Si no puedes asistir, por favor confírmalo en el formulario. Lamentamos mucho no poder compartir este día contigo, pero agradecemos que nos lo comuniques con antelación.',
      open: false
    },
    {
      question: '¿Necesito traer un regalo?',
      answer: 'Tu presencia es el mejor regalo que podríamos recibir. No es obligatorio traer regalo, pero si quieres hacernos un detalle, puedes consultar nuestra <a routerLink="/regalos">lista de regalos</a>. Lo importante es que estés ahí para celebrar con nosotros.',
      open: false
    },
    {
      question: '¿Cómo puedo contactar con vosotros si tengo problemas técnicos?',
      answer: 'Si tienes problemas técnicos con la web o el formulario de confirmación, puedes contactarnos directamente por email a <strong>Fouadn9@gmail.com</strong> o por teléfono al <strong>+34 600 07 54 39</strong>. Estaremos encantados de ayudarte.',
      open: false
    }
  ];

  toggleFaq(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }
}
