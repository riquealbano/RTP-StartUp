import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { MenuSuperior } from './menu-superior/menu-superior';
import { Home } from './home/home';
import { Calculadora } from './calculadora/calculadora';
import { Sobre } from './sobre/sobre';
import { Destaque } from './destaque/destaque';
import { Footer } from './footer/footer';
import { Login } from './login/login';
import { Cadastro } from './cadastro/cadastro';

@NgModule({
  declarations: [
    App,
    MenuSuperior,
    Home,
    Calculadora,
    Sobre,
    Destaque,
    Footer,
    Login,
    Cadastro
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
