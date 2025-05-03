import { Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { StreamComponent } from './stream/stream.component';

export const routes: Routes = [
    { path: '', component: StreamComponent},
    { path: 'settings', component: SettingsComponent}
];
