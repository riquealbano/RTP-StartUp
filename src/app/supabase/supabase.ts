import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 💡 IMPORTANTE: Você precisa criar e configurar este arquivo de ambiente
// para conter suas chaves do Supabase!
import { environment } from '../../environments/environments'; 

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  
  private supabase: SupabaseClient;

  constructor() {
    // A inicialização do cliente Supabase, replicando a lógica do 'supabase.js'
    this.supabase = createClient(
      environment.supabaseUrl, 
      environment.supabaseKey
    );
  }

  // ------------------------------------------------------------------
  // MÉTODOS DE AUTENTICAÇÃO
  // ------------------------------------------------------------------

  // Método de Login (SignIn)
  signInWithEmail(email: string, password: string) {
    // Retorna a promessa de autenticação do Supabase
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  // Método de Cadastro (SignUp)
  signUp(email: string, password: string) {
    // Retorna a promessa de cadastro do Supabase
    // O Supabase, por padrão, envia um e-mail de confirmação
    return this.supabase.auth.signUp({ email, password });
  }
  
  // Método para obter o estado atual do usuário
  get user() {
    return this.supabase.auth.getUser();
  }

  // Método para fazer Logout
  signOut() {
    return this.supabase.auth.signOut();
  }
}