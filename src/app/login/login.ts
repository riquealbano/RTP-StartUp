import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase/supabase';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login implements OnInit {
  
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private supabaseService: SupabaseService // ⬅️ NOVO SERVICE INJETADO
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async handleLogin(): Promise<void> {
    if (this.loginForm.invalid) {
      alert('Por favor, preencha o e-mail (válido) e a senha.');
      return;
    }

    const { email, password } = this.loginForm.value;

    try {
      // 🚀 Chamada REAL ao serviço Supabase
      const { data, error } = await this.supabaseService.signInWithEmail(email, password);
      
      if (error) {
        // Erro do Supabase (ex: credenciais incorretas)
        console.error("Erro no login:", error.message);
        alert(`Erro: ${error.message}`);
        
      } else if (data.user) {
        // Login bem-sucedido
        console.log("Login realizado com sucesso!", data.user);
        alert("Login realizado com sucesso!");
        
        // Redireciona para o catálogo/home
        this.router.navigate(['/home']); 

      } else {
        // Caso incomum onde não há erro mas também não há usuário
         alert("Não foi possível autenticar. Tente novamente.");
      }
      
    } catch (error) {
      console.error("Erro na comunicação:", error);
      alert("Ocorreu um erro inesperado.");
    }
  }
}