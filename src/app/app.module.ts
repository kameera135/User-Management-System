import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LayoutsModule } from "./layouts/layouts.module";
import { PagesModule } from "./pages/pages.module";

// Auth
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { initFirebaseBackend } from './authUtils';

// Language
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgToastModule } from 'ng-angular-popup';
import { AppService } from './app.service';
import { LoginComponent } from './auth/login/login.component';
import { DEFAULT_TIMEOUT, TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    LayoutsModule,
    PagesModule,
    NgbModule,
    NgToastModule
  ],
  providers: [
    [{
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppService],
      useFactory: (service: AppService) => { //Note : This method loads the configuration from a json file on the application load
        return () => {
          return service.init();
        }
      }
    }],
    [{ provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true }],
    [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
    [{ provide: DEFAULT_TIMEOUT, useValue: 3000000 }],
    AuthGuard,
    AuthService
    /*,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true }*/
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
