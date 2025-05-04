import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  userSettings!: FormGroup<{
    name: FormControl<string | null>;
    ip: FormControl<string | null>;
  }>;
  isEditing = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.userSettings = this.fb.group({
      name: this.fb.control<string>(localStorage.getItem('name') || 'N/A'),
      ip: this.fb.control<string>(localStorage.getItem('ip') || 'X.X.X.X'),
    });
  }

  edit() {
    this.isEditing = true;
  }

  cancel() {
    let cancelConfirm = window.confirm("changes will be discarded. are you sure you want to continue?");
    if (cancelConfirm) {
      this.isEditing = false;
      this.userSettings.setValue({
        name: localStorage.getItem('name') || 'N/A',
        ip: localStorage.getItem('ip') || 'X.X.X.X',
      });
    }
  }

  onSubmit(): void {
    this.isEditing = false;
    localStorage.setItem('ip', this.f.ip.value ?? '');
    localStorage.setItem('name', this.f.name.value ?? '');
  }

  get f() {
    return this.userSettings.controls;
  }
}
