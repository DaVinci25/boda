import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RsvpService, RsvpData } from '../../services/rsvp.service';

@Component({
  selector: 'app-rsvp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.css']
})
export class RsvpComponent implements OnInit {
  rsvpForm: FormGroup;
  submitted = false;
  success = false;
  error = false;
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private rsvpService: RsvpService
  ) {
    this.rsvpForm = this.createForm();
  }

  ngOnInit(): void {
    this.setupFormListeners();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      attendance: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      totalGuests: [1, [Validators.required, Validators.min(1)]],
      guestNames: [''],
      bringingChildren: [false],
      numberOfChildren: [0],
      menuType: [''],
      dietaryRestrictions: [''],
      songRequest: [''],
      message: [''],
      privacyConsent: [false, Validators.requiredTrue]
    });
  }

  private setupFormListeners(): void {
    // Controlar asistencia
    this.rsvpForm.get('attendance')?.valueChanges.subscribe((value: string) => {
      const totalGuestsControl = this.rsvpForm.get('totalGuests');
      
      if (value === 'no') {
        totalGuestsControl?.clearValidators();
        totalGuestsControl?.setValue(0);
        this.rsvpForm.patchValue({
          bringingChildren: false,
          numberOfChildren: 0
        }, { emitEvent: false });
      } else {
        totalGuestsControl?.setValidators([Validators.required, Validators.min(1)]);
        totalGuestsControl?.setValue(1, { emitEvent: false });
      }
      totalGuestsControl?.updateValueAndValidity();
    });

    // Controlar hijos
    this.rsvpForm.get('bringingChildren')?.valueChanges.subscribe((value: boolean) => {
      const childrenControl = this.rsvpForm.get('numberOfChildren');
      if (!value) {
        childrenControl?.setValue(0);
      }
    });
  }

  // Getter para acceder a los controles
  get f() {
    return this.rsvpForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = false;
    this.success = false;
    this.errorMessage = '';

    if (this.rsvpForm.invalid) {
      // Marcar todos los controles como tocados
      Object.keys(this.rsvpForm.controls).forEach(key => {
        const control = this.rsvpForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    const formData: RsvpData = this.rsvpForm.value;

    this.rsvpService.submitRsvp(formData).subscribe({
      next: (response: any) => {
        console.log('✅ RSVP procesado:', response);
        
        // Verificar el estado del envío
        if (response.emailSent && response.excelSaved) {
          console.log('✅ Email enviado y guardado en Excel correctamente');
        } else if (response.emailSent && !response.excelSaved) {
          console.warn('⚠️ Email enviado pero no se pudo guardar en Excel');
        } else if (!response.emailSent && response.excelSaved) {
          console.warn('⚠️ Guardado en Excel pero no se pudo enviar el email');
        }
        
        // Notificar a los novios (opcional)
        this.rsvpService.notifyCouple(formData).subscribe();
        
        this.success = true;
        this.resetForm();
        this.scrollToTop();
      },
      error: (error: Error) => {
        console.error('❌ Error:', error);
        this.error = true;
        this.errorMessage = error.message || 'Error al enviar la confirmación. Por favor, inténtalo de nuevo.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private resetForm(): void {
    this.rsvpForm.reset({
      attendance: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      totalGuests: 1,
      guestNames: '',
      bringingChildren: false,
      numberOfChildren: 0,
      menuType: '',
      dietaryRestrictions: '',
      songRequest: '',
      message: '',
      privacyConsent: false
    });
    this.submitted = false;
  }

  private scrollToTop(): void {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }

  // Getters para la vista
  get isAttending(): boolean {
    return this.rsvpForm.get('attendance')?.value === 'yes';
  }

  get isNotAttending(): boolean {
    return this.rsvpForm.get('attendance')?.value === 'no';
  }

  get isBringingChildren(): boolean {
    return this.rsvpForm.get('bringingChildren')?.value === true;
  }

  // Helper para mostrar errores
  showError(controlName: string): boolean {
    const control = this.rsvpForm.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted);
  }
}