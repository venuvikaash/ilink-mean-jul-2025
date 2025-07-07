/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { ApplicationRef } from '@angular/core';
import { appConfig } from './app/app.config';
import { RootComponent } from './app/root/root.component';

type CustomWindow = Window & typeof globalThis & { ngRef?: ApplicationRef };

bootstrapApplication(RootComponent, appConfig)
  .then((ref) => {
    let customWindow: CustomWindow = window;

    // Ensure Angular destroys itself on hot reloads.
    if ('ngRef' in customWindow) {
      customWindow.ngRef?.destroy();
    }

    customWindow.ngRef = ref;

    // console.log(customWindow);
  })
  .catch((err) => console.error(err));
