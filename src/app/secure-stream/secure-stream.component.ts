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
  ip: string = ""; // esp ip being streamed to
  isStreaming: boolean = false;
  micPermission: boolean = false;
  currentSpeaker: string = "";
  socket: WebSocket

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.socket = new WebSocket("ws://localhost:8000/ws");
    this.socket.onmessage = (event) => {
      if (event.data.includes("MIC_PERM")) {
        const micPermValue = event.data.split("MIC_PERM")[1]?.trim();
        this.micPermission = micPermValue === "True";
      } else if (event.data.includes("SPEAKER")) {
        this.currentSpeaker = event.data.split("SPEAKER")[1]?.trim();
      }
      // TODO include other instances like if admin broadcasts a question
    }

  }

  ngOnInit(): void {
    this.sessionInfo = this.fb.group({
      sessionId: this.fb.control<string>(localStorage.getItem('connected') || ''),
    });
    this.connected = localStorage.getItem('connected') ? true : false;
    this.name = localStorage.getItem('name') ?? 'N/A';
    this.ip = localStorage.getItem('ip') ?? 'X.X.X.X';
    // make request to admin if connected to a session to get current mic status
    // first get this user's own ip
    if (this.connected) {
      this.apiService.getBackendRequest('admin_ip').subscribe({
        next: (response) => {
          this.apiService.customGetRequest(
            `http://${localStorage.getItem('connected')}:8000/get_status/?user_ip=${response.admin_ip}`
          ).subscribe({
            next: (response) => {
              console.log(response);
              this.micPermission = response.mic_status;
              this.connected = response.connected_status;
            },
            error: (error) => {
              console.error(error);
            }
          })
        },
        error: (error) => {
          console.error(error);
        }
      })

      
    }
  }

  toggleStream(): void {
    this.isStreaming = !this.isStreaming;
    // broadcast name if streaming is on, broadcast "" is streaming is off
    if (this.isStreaming) {
      this.apiService.customPostRequest(
        `http://${localStorage.getItem('connected')}:8000/broadcast_name`, 
        { msg: localStorage.getItem('name') })
        .subscribe({
          next: (response) => {
            console.log(response);
          },
          error: (error) => {
            console.error(error);
          }
        })
    } else {
      this.apiService.customPostRequest(
        `http://${localStorage.getItem('connected')}:8000/broadcast_name`, 
        { msg: "" })
        .subscribe({
          next: (response) => {
            console.log(response);
          },
          error: (error) => {
            console.error(error);
          }
        })
    }    

    // start streaming to esp
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
