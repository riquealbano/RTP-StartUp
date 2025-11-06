import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase/supabase'; // Ajuste o caminho se necessário

// 💡 FUNÇÃO VALIDADORA PERSONALIZADA
// Esta função verifica se os campos 'password' e 'passwordConfirm' coincidem.
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
  const password = control.get('password');
  const passwordConfirm = control.get('passwordConfirm');

  // Retorna null (válido) se os campos ainda não existirem ou forem iguais
  if (!password || !passwordConfirm) {
    return null;
  }
  
  // Retorna 'mismatch' (inválido) se os valores forem diferentes
  return password.value === passwordConfirm.value ? null : { mismatch: true };
};

// src/app/cadastro/cadastro.component.ts (Continuação)

@Component({
  selector: 'app-cadastro',
  standalone: false,
  templateUrl: './cadastro.html', // Ou './cadastro.component.html'
  styleUrls: ['./cadastro.css'], // Ou './cadastro.component.css'
})
export class Cadastro implements OnInit {
  
  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private supabaseService: SupabaseService
  ) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required]]
    }, {
      // Aplica o validador customizado no Form Group, no nível do 'control' (grupo de campos)
      validator: passwordMatchValidator 
    });
  }

  async handleSignup(): Promise<void> {
    // A validação de 'mismatch' e 'required' é feita automaticamente
    if (this.signupForm.invalid) {
      alert('Por favor, verifique todos os campos.');
      return;
    }

    const { email, password } = this.signupForm.value;

    try {
      // 🚀 Chamada Supabase para registro (signUpWithEmail)
      const { data, error } = await this.supabaseService.signInWithEmail(email, password);
      
      if (error) {
        // Erro do Supabase (ex: email já registrado)
        console.error("Erro no cadastro:", error.message);
        alert(`Erro: ${error.message}.`);
        
      } else if (data.user) {
        // Sucesso: Supabase envia um e-mail de confirmação
        console.log("Cadastro realizado com sucesso!", data.user);
        alert("Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta.");
        
        // Redireciona para o login (conforme lógica do professor)
        this.router.navigate(['/login']); 

      } else {
        alert("Não foi possível realizar o cadastro. Tente novamente.");
      }
      
    } catch (error) {
      console.error("Erro na comunicação:", error);
      alert("Ocorreu um erro inesperado durante o cadastro.");
    }
  }
}