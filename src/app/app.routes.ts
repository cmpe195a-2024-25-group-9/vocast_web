import { Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { StreamComponent } from './stream/stream.component';
import { AdminComponent } from './admin/admin.component';
import { SecureStreamComponent } from './secure-stream/secure-stream.component';

export const routes: Routes = [
    { path: '', component: SecureStreamComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'stream-test', component: StreamComponent}
];
