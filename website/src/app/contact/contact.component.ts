import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EmailService } from '../core/services/email.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  providers: [HttpClient],
})
export class ContactComponent {
  isLoading = false;
  form!: FormGroup;

  constructor(private emailService: EmailService) {
    this.form = new FormGroup({
      first_name: new FormControl(null, [Validators.required]),
      last_name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required]),
      message: new FormControl(null, [Validators.required]),
    });
  }

  async submitContact(payload: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    message: string;
  }) {
    this.isLoading = true;
    try {
      const sent = await this.emailService.addContact({
        FirstName: payload.first_name,
        LastName: payload.last_name,
        Email: payload.email,
        Status: 'Transactional',
        CustomFields: {
          message: payload.message,
          phone: payload.phone,
        },
      });
      if (sent) {
        this.isLoading = false;
      }
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }
}
