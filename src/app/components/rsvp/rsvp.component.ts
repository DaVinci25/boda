import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RsvpService } from '../../services/rsvp.service';

@Component({
  selector: 'app-rsvp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rsvp.component.html',
  styleUrl: './rsvp.component.css'
})
export class RsvpComponent {
  rsvpForm: FormGroup;
  submitted = false;
  success = false;
  error = false;

  constructor(
    private fb: FormBuilder,
    private rsvpService: RsvpService
  ) {
    this.rsvpForm = this.fb.group({
      attendance: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      totalGuests: [1, [Validators.required, Validators.min(1)]],
      guestNames: [''],
      bringingChildren: [false],
      numberOfChildren: [0, [Validators.min(0)]],
      menuType: [''],
      dietaryRestrictions: [''],
      songRequest: [''],
      message: [''],
      privacyConsent: [false, Validators.requiredTrue]
    });

    // Mostrar campos adicionales solo si asiste
    this.rsvpForm.get('attendance')?.valueChanges.subscribe(value => {
      if (value === 'no') {
        this.rsvpForm.patchValue({
          totalGuests: 0,
          bringingChildren: false,
          numberOfChildren: 0,
          menuType: '',
          dietaryRestrictions: '',
          songRequest: ''
        });
      } else if (value === 'yes') {
        this.rsvpForm.patchValue({
          totalGuests: 1
        });
      }
    });

    // Resetear número de hijos si no traen hijos y actualizar validación
    this.rsvpForm.get('bringingChildren')?.valueChanges.subscribe(value => {
      const numberOfChildrenControl = this.rsvpForm.get('numberOfChildren');
      if (!value) {
        this.rsvpForm.patchValue({
          numberOfChildren: 0
        });
        numberOfChildrenControl?.clearValidators();
      } else {
        numberOfChildrenControl?.setValidators([Validators.required, Validators.min(1)]);
      }
      numberOfChildrenControl?.updateValueAndValidity();
    });
  }

  get f() {
    return this.rsvpForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.error = false;

    if (this.rsvpForm.invalid) {
      return;
    }

    const formData = this.rsvpForm.value;
    
    // Enviar datos al servicio
    this.rsvpService.submitRsvp(formData).subscribe({
      next: (response) => {
        // Notificar a los novios
        this.rsvpService.notifyCouple(formData).subscribe();
        
        this.success = true;
        this.rsvpForm.reset();
        this.submitted = false;
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => {
        this.error = true;
        console.error('Error al enviar RSVP:', error);
      }
    });
  }

  get isAttending() {
    return this.rsvpForm.get('attendance')?.value === 'yes';
  }

  get isNotAttending() {
    return this.rsvpForm.get('attendance')?.value === 'no';
  }

  get isBringingChildren() {
    return this.rsvpForm.get('bringingChildren')?.value === true;
  }
}
