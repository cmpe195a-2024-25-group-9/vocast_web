import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ApiService } from '../apiService/api.service';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  connectedUsers: Array<{ name: string; address: string; status: boolean }> = [];
  adminIP: string = 'X.X.X.X';
  espIP: string = 'X.X.X.X';
  postQuestion!: FormGroup<{
    question: FormControl<string | null>;
  }>;
  socket: WebSocket
  raisedHands: Array<string> = []

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.socket = new WebSocket("ws://localhost:8000/ws");
    this.socket.onmessage = (event) => {
      console.log(event.data);
      if (event.data.includes("RAISE_HAND")) {
        const studentName = event.data.split("RAISE_HAND")[1]?.trim();
        this.raisedHands.push(studentName);
      } else if (event.data.includes("LOWER_HAND")) {
        const studentName = event.data.split("LOWER_HAND")[1]?.trim();
        const index = this.raisedHands.indexOf(studentName);
        if (index !== -1) {
          this.raisedHands.splice(index, 1);
        }
      }
    }
  }

  ngOnInit(): void {
    this.postQuestion = this.fb.group({
      question: this.fb.control<string>(""),
    });

    this.apiService.getBackendRequest('admin_ip').subscribe({
      next: (response: any) => {
        this.adminIP = response.admin_ip;
      },
      error: (error: any) => {
        console.error('Error fetching admin IP:', error);
      }
    });
    this.apiService.getBackendRequest('esp_ip').subscribe({
      next: (response: any) => {
        this.espIP = response.esp_ip;
      },
      error: (error: any) => {
        console.error('Error fetching admin IP:', error);
      }
    });
    this.getActiveConnections();
  }

  clearRaisedHandsQueue() {
    this.raisedHands = [];
  }

  submitQuestion() {
    this.apiService.postBackendRequest('post_question', { msg: this.postQuestion.value.question }).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  clearQuestion() {
    this.postQuestion.patchValue({ question: "" });
    this.apiService.postBackendRequest('post_question', {msg: ""}).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  getActiveConnections() {
    this.apiService.getBackendRequest('active_connections').subscribe({
      next: (response: any) => {
        this.connectedUsers = response.active_connections;
      },
      error: (error: any) => {
        console.error("error getting active connections");
      }
    });
  }

  toggleMicPermission(user: any) {
    console.log(user);
    this.apiService.postBackendRequest('toggle_mic_permission', {ip: user.address, name: user.name}).subscribe({
      next: (response: any) => {
        console.log(response.message);
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  
}
