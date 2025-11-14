import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
//added(change the route)
import { provideHttpClient,withFetch } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UsersModule } from './users/users-module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// PrimeNG Configuration
import {providePrimeNG} from 'primeng/config';

// Theme (Aura example)
import Aura from '@primeuix/themes/aura';
import { ButtonModule } from 'primeng/button';




@NgModule({
  declarations: [
    App,
   
  ],
  imports: [
    
    BrowserModule,
    AppRoutingModule,
    UsersModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    BrowserAnimationsModule
  ],
  providers: [
    provideHttpClient(withFetch()),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
    providePrimeNG({
      theme: {
        preset: Aura
      },
      ripple: true  // optional, enables ripple effect
    })
  ],
  bootstrap: [App]
})
export class AppModule { 
   
}
