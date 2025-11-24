import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MenuComponent } from '../../components/menu/menu.component';
import { CommonModule } from '@angular/common';

type Editavel = 'email' | 'telefone' | 'cep' | 'numero' | 'senha';

@Component({
  selector: 'app-atualizar-perfil',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, MenuComponent, CommonModule],
  templateUrl: './atualizar-perfil.html',
  styleUrls: ['./atualizar-perfil.css'],
})
export class AtualizarPerfilComponent implements OnInit {

  perfilForm!: FormGroup;

  edit: Record<Editavel, boolean> = {
    email: false,
    telefone: false,
    cep: false,
    numero: false,
    senha: false,
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.perfilForm = this.fb.group(
      {
        // sempre bloqueados
        username: [{ value: '', disabled: true }],
        nome: [{ value: '', disabled: true }],
        cpf: [{ value: '', disabled: true }],
        nascimento: [{ value: '', disabled: true }],

        // começam readonly
        email: ['', [Validators.required, Validators.email]],
        telefone: [''],
        cep: [''],
        numero: [''],

        senha: ['', Validators.minLength(6)],
        confirmarSenha: [''],
      },
      { validators: this.senhasIguais() }
    );

    const mock = {
      username: "alberto",
      nome: "Alberto Dias",
      cpf: "12345678900",
      dtNascimento: "2000-05-10",
      cep: "01311000",
      telefone: "11987654321",
      email: "alberto@teste.com",
    };

    this.carregarDados(mock);
  }

  carregarDados(d: any) {
    this.perfilForm.patchValue({
      username: d.username,
      nome: d.nome,
      cpf: this.formatCPF(d.cpf),
      nascimento: d.dtNascimento,
      email: d.email,
      telefone: this.formatPhone(d.telefone),
      cep: this.formatCEP(d.cep),
    });
  }

  ativarEdicao(field: Editavel) {
    if (!this.edit[field]) {
      this.edit[field] = true;
    }
  }

  onCPFInput(e: any) {
    const v = e.target.value.replace(/\D/g, '');
    this.perfilForm.patchValue({ cpf: this.formatCPF(v) }, { emitEvent: false });
  }

  onCEPInput(e: any) {
    const v = e.target.value.replace(/\D/g, '');
    this.perfilForm.patchValue({ cep: this.formatCEP(v) }, { emitEvent: false });
  }

  onPhoneInput(e: any) {
    const v = e.target.value.replace(/\D/g, '');
    this.perfilForm.patchValue({ telefone: this.formatPhone(v) }, { emitEvent: false });
  }

  formatCPF(v: string): string {
    return v.replace(/^(\d{3})(\d)/, "$1.$2")
            .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1-$2")
            .slice(0, 14);
  }

  formatCEP(v: string): string {
    return v.replace(/^(\d{5})(\d)/, "$1-$2").slice(0, 9);
  }

  formatPhone(v: string): string {
    return v.length <= 10
      ? v.replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2")
      : v.replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
  }

  senhasIguais() {
    return (form: AbstractControl) => {
      const s1 = form.get('senha')?.value;
      const s2 = form.get('confirmarSenha')?.value;
      return s1 && s2 && s1 !== s2 ? { senhaMismatch: true } : null;
    };
  }

  onSubmit() {
    if (!this.perfilForm.valid) return;
    console.log('Enviado:', this.perfilForm.getRawValue());
  }
}
