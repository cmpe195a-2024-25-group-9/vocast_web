import { Component } from '@angular/core';
import { ApiService } from '../apiService/api.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stream',
  imports: [CommonModule, MatIconModule],
  templateUrl: './stream.component.html',
  styleUrl: './stream.component.css'
})
export class StreamComponent {
  isStreaming: boolean = false;
  name: string = '';
  ip: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.name = localStorage.getItem('name') ?? 'N/A';
    this.ip = localStorage.getItem('ip') ?? 'X.X.X.X';
  }

  navigateToSettings() {
    window.location.href = '/settings';
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
}
