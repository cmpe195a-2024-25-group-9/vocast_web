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

  constructor(private apiService: ApiService) {}

  toggleStream(): void {
    this.isStreaming = !this.isStreaming;
    this.apiService.postBackendRequest('stream', { start: this.isStreaming, IP: "10.0.0.12" }).subscribe({
      next: (response) => {
        console.log('Stream toggled successfully:', response);
      },
      error: (error) => {
        console.error('Error toggling stream:', error);
      }
    });
  }
}
