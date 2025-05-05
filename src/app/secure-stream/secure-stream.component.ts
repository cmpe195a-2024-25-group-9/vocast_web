import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ApiService } from '../apiService/api.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-secure-stream',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './secure-stream.component.html',
  styleUrl: './secure-stream.component.css'
})
export class SecureStreamComponent {
  connected: boolean = false;
  sessionInfo!: FormGroup<{
    sessionId: FormControl<string | null>;
  }>;
  name: string = "";
  ip: string = "";
  isStreaming: boolean = false;
  micPermission: boolean = false;
  socket: WebSocket

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.socket = new WebSocket("ws://localhost:8000/ws");
    this.socket.onmessage = (event) => {
      console.log("Admin says: ", event.data);
      this.micPermission = event.data === "True";
    }
  }

  ngOnInit(): void {
    this.sessionInfo = this.fb.group({
      sessionId: this.fb.control<string>(localStorage.getItem('connected') || ''),
    });
    this.connected = localStorage.getItem('connected') ? true : false;
    this.name = localStorage.getItem('name') ?? 'N/A';
    this.ip = localStorage.getItem('ip') ?? 'X.X.X.X';
  }

  toggleStream(): void {
    this.isStreaming = !this.isStreaming;
    this.apiService.postBackendRequest('stream', { start: this.isStreaming, ip: this.ip }).subscribe({
      next: (response) => {
        console.log('Stream toggled successfully:', response);
      },
      error: (error) => {
        console.error('Error toggling stream:', error);
      }
    });
  }

  leaveSession() {
    this.connected = false;
    localStorage.removeItem('connected');
    this.apiService.postBackendRequest('leave_session', {ip: this.sessionInfo.value.sessionId, name: localStorage.getItem('name') || 'N/A'}).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  onSubmit(): void {
    const sessionId = this.sessionInfo.value.sessionId;
    console.log(sessionId);
    this.apiService.postBackendRequest('connect_to_session', {ip: sessionId, name: localStorage.getItem('name') || 'N/A'}).subscribe({
      next: (response) => {
        console.log('Session submitted successfully:', response);
        this.connected = true;
        localStorage.setItem('connected', sessionId || '');
      },
      error: (error) => {
        console.error('Error submitting session:', error);
      }
    });
  }
}
