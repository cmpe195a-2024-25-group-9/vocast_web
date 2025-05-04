import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../apiService/api.service';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  connectedUsers: Array<{ name: string; address: string; status: boolean }> = [];
  adminIP: string = 'X.X.X.X';
  espIP: string = 'X.X.X.X';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
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
  }
}
