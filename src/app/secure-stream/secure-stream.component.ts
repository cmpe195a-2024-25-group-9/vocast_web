import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ApiService } from '../apiService/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-secure-stream',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './secure-stream.component.html',
  styleUrl: './secure-stream.component.css'
})
export class SecureStreamComponent {
  connected: boolean = false;
  sessionInfo!: FormGroup<{
    sessionId: FormControl<string | null>;
  }>;

  constructor(private fb: FormBuilder, private apiService: ApiService) {}

  ngOnInit(): void {
    this.sessionInfo = this.fb.group({
      sessionId: this.fb.control<string>(''),
    });
  }

  onSubmit(): void {
    const sessionId = this.sessionInfo.value.sessionId;
    console.log(sessionId);
    this.apiService.postBackendRequest('connect_to_session', {ip: sessionId}).subscribe({
      next: (response) => {
        console.log('Session submitted successfully:', response);
        this.connected = true;
      },
      error: (error) => {
        console.error('Error submitting session:', error);
      }
    });
  }
}
