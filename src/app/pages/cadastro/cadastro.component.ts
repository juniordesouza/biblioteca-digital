import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HomeHeaderComponent } from '../../components/home-header/home-header.component';

/* ---------------- VALIDAÇÕES PERSONALIZADAS ------------------ */

// Valida senha == confirmar senha
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const pass = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return pass === confirm ? null : { passwordMismatch: true };
}

// Valida se contém só números
function onlyNumbersValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  return /^[0-9]+$/.test(value) ? null : { onlyNumbers: true };
}

// Valida telefone com 10 ou 11 dígitos
function phoneLengthValidator(control: AbstractControl): ValidationErrors | null {
  const value = (control.value || '').replace(/\D/g, '');
  return value.length === 10 || value.length === 11 ? null : { invalidLength: true };
}

// Valida DDD válido no Brasil
const ddList = [
  "11","12","13","14","15","16","17","18","19",
  "21","22","24","27","28",
  "31","32","33","34","35","37","38",
  "41","42","43","44","45","46",
  "47","48","49",
  "51","53","54","55",
  "61","62","64",
  "65","66",
  "67",
  "68","69",
  "71","73","74","75","77",
  "79",
  "81","87",
  "82",
  "83",
  "84",
  "85","88",
  "86","89",
  "91","93","94",
  "92","97",
  "95",
  "96",
  "98","99"
];

function dddValidator(control: AbstractControl): ValidationErrors | null {
  const value = (control.value || '').replace(/\D/g, '');
  const ddd = value.substring(0, 2);
  return ddList.includes(ddd) ? null : { invalidDDD: true };
}

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HomeHeaderComponent]
})
export class CadastroComponent {

  private fb = inject(FormBuilder);
  private router = inject(Router);

  estados: string[] = [
    "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
    "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
  ];

  cadastroForm: FormGroup = this.fb.group(
    {
      fullName: ['', Validators.required],

      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        ]
      ],

      username: ['', Validators.required],
      cpf: ['', [Validators.required, onlyNumbersValidator]],

      telefone: [
        '',
        [
          Validators.required,
          onlyNumbersValidator,
          phoneLengthValidator,
          dddValidator
        ]
      ],

      rua: ['', Validators.required],
      cep: ['', [Validators.required, onlyNumbersValidator]],
      numero: ['', Validators.required],
      estado: ['', Validators.required],

      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],

      gender: ['', Validators.required]
    },
    { validators: passwordMatchValidator }
  );

  /* FORMATAÇÃO AO EXIBIR (sem símbolos) */
  formatPhone(): string {
    const raw = (this.cadastroForm.get('telefone')?.value || '').replace(/\D/g, '');

    if (raw.length <= 10) {
      return raw.replace(/(\d{2})(\d{4})(\d{0,4})/, "$1 $2-$3").trim();
    }

    return raw.replace(/(\d{2})(\d{5})(\d{0,4})/, "$1 $2-$3").trim();
  }

  /* Remover formatação para enviar ao backend */
  sanitizePhone() {
    const value = this.cadastroForm.get('telefone')?.value;
    this.cadastroForm.get('telefone')?.setValue(value.replace(/\D/g, ''));
  }

  onSubmit() {
    if (this.cadastroForm.valid) {
      this.sanitizePhone(); // deixa só números
      console.log("FORM:", this.cadastroForm.value);
      this.router.navigate(['/catalogo']);
    }
  }

  // regras da senha (dinâmicas)
  get password() {
    return this.cadastroForm.get('password')?.value || '';
  }

  passwordRules = [
    { label: "Mínimo de 6 caracteres", check: () => this.password.length >= 6 },
    { label: "Letra maiúscula", check: () => /[A-Z]/.test(this.password) },
    { label: "Letra minúscula", check: () => /[a-z]/.test(this.password) },
    { label: "Número", check: () => /[0-9]/.test(this.password) },
    { label: "Caractere especial (!@#$%)", check: () => /[!@#$%^&*(),.?":{}|<>]/.test(this.password) }
  ];
}
