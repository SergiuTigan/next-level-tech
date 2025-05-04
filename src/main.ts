// src/main.ts

import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config'; // Import application configuration
import {AppComponent} from './app/app.component'; // Import your root component

// Bootstrap the standalone AppComponent using the application configuration
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err)); // Basic error handling
