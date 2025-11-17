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

/* -----------------------------------------------------
   VALIDADORES
------------------------------------------------------ */

// Valida senha == confirmar senha
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const pass = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return pass === confirm ? null : { passwordMismatch: true };
}

// Somente números
function onlyNumbersValidator(control: AbstractControl): ValidationErrors | null {
  const raw = (control.value || '').replace(/\D/g, '');
  return /^[0-9]+$/.test(raw) ? null : { onlyNumbers: true };
}

// Comprimento 11 dígitos CPF
function cpfLengthValidator(control: AbstractControl): ValidationErrors | null {
  const raw = (control.value || '').replace(/\D/g, '');
  return raw.length === 11 ? null : { invalidCPFLength: true };
}

// Validação oficial de CPF
function cpfValidator(control: AbstractControl): ValidationErrors | null {
  let cpf = (control.value || '').replace(/\D/g, '');
  if (cpf.length !== 11) return null;

  if (/^(\d)\1+$/.test(cpf)) return { invalidCPF: true };

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
  let dig1 = (soma * 10) % 11;
  if (dig1 === 10) dig1 = 0;
  if (dig1 !== parseInt(cpf[9])) return { invalidCPF: true };

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
  let dig2 = (soma * 10) % 11;
  if (dig2 === 10) dig2 = 0;
  if (dig2 !== parseInt(cpf[10])) return { invalidCPF: true };

  return null;
}

/* TELEFONE */

// Tamanho 10 ou 11
function phoneLengthValidator(control: AbstractControl): ValidationErrors | null {
  const raw = (control.value || '').replace(/\D/g, '');
  return raw.length === 10 || raw.length === 11 ? null : { invalidLength: true };
}

// DDD válido
const dddList = [
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
  const raw = (control.value || '').replace(/\D/g, '');
  const ddd = raw.substring(0, 2);
  return dddList.includes(ddd) ? null : { invalidDDD: true };
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

      cpf: [
        '',
        [
          Validators.required,
          onlyNumbersValidator,
          cpfLengthValidator,
          cpfValidator
        ]
      ],

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

    // Trata CPF enquanto o usuário digita
  onCPFInput(event: any) {
    const raw = event.target.value.replace(/\D/g, '');
    this.cadastroForm.get('cpf')?.setValue(raw, { emitEvent: false });
  }

  // Trata telefone enquanto digita
  onPhoneInput(event: any) {
    const raw = event.target.value.replace(/\D/g, '');
    this.cadastroForm.get('telefone')?.setValue(raw, { emitEvent: false });
  }


  /* --------- FORMATAÇÕES VISUAIS ----------- */

  formatCPF(): string {
    const raw = (this.cadastroForm.get('cpf')?.value || '').replace(/\D/g, '');
    return raw
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  formatPhone(): string {
    const raw = (this.cadastroForm.get('telefone')?.value || '').replace(/\D/g, '');

    if (raw.length <= 10)
      return raw.replace(/(\d{2})(\d{4})(\d{0,4})/, "$1 $2-$3");

    return raw.replace(/(\d{2})(\d{5})(\d{0,4})/, "$1 $2-$3");
  }

  sanitizeAll() {
    this.cadastroForm.get('cpf')?.setValue(
      this.cadastroForm.get('cpf')?.value.replace(/\D/g, '')
    );
    this.cadastroForm.get('telefone')?.setValue(
      this.cadastroForm.get('telefone')?.value.replace(/\D/g, '')
    );
  }

  onSubmit() {
    if (this.cadastroForm.valid) {
      this.sanitizeAll();
      console.log("FORM:", this.cadastroForm.value);
      this.router.navigate(['/catalogo']);
    }
  }

  /* regras da senha (dinâmicas) */
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
