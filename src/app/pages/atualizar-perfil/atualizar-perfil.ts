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
import { AuthService } from '../../auth.service';
import { PerfilService } from '../../services/perfil.service';
import { HttpClient } from '@angular/common/http';
import { ToastComponent } from '../../components/toast.component/toast.component';

type Editavel = 'email' | 'telefone' | 'cep' | 'endereco' | 'numero' | 'senha';

@Component({
  selector: 'app-atualizar-perfil',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, MenuComponent, CommonModule, ToastComponent],
  templateUrl: './atualizar-perfil.html',
  styleUrls: ['./atualizar-perfil.css'],
})
export class AtualizarPerfilComponent implements OnInit {

  perfilForm!: FormGroup;

  toastMessage = '';
  toastShow = false;

  edit: Record<Editavel, boolean> = {
    email: false,
    telefone: false,
    cep: false,
    endereco: false,
    numero: false,
    senha: false,
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private perfilService: PerfilService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    this.perfilForm = this.fb.group(
      {
        username: [{ value: '', disabled: true }],
        nome: [{ value: '', disabled: true }],
        cpf: [{ value: '', disabled: true }],
        nascimento: [{ value: '', disabled: true }],

        email: ['', [Validators.required, Validators.email]],
        telefone: [''],
        cep: [''],
        endereco: [''],
        numero: [''],

        senha: [''],
        confirmarSenha: [''],
      },
      { validators: this.senhasIguais() }
    );

    this.authService.userState$.subscribe(state => {
      if (state?.username) {
        this.perfilService.perfil$.subscribe(data => {
          if (data) this.carregarDados(data);
        });
      }
    });
  }

  carregarDados(d: any) {
    this.perfilForm.patchValue({
      username: d.username,
      nome: d.nome,
      cpf: this.formatCPF(d.cpf || ''),
      nascimento: d.dtNascimento,
      email: d.email,
      telefone: this.formatPhone(d.telefone || ''),
      cep: this.formatCEP(d.cep || ''),
      endereco: d.endereco || '',
    });
  }

  ativarEdicao(field: Editavel) {
    this.edit[field] = true;
  }

  onCEPInput(e: any) {
    const v = e.target.value.replace(/\D/g, '');
    this.perfilForm.patchValue({ cep: this.formatCEP(v) }, { emitEvent: false });
  }

  onPhoneInput(e: any) {
    const v = e.target.value.replace(/\D/g, '');
    this.perfilForm.patchValue({ telefone: this.formatPhone(v) }, { emitEvent: false });
  }

  formatCPF(v: any): string {
    if (!v) return '';
    v = v.toString();
    return v.replace(/^(\d{3})(\d)/, "$1.$2")
            .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1-$2")
            .slice(0, 14);
  }

  formatCEP(v: any): string {
    if (!v) return '';
    v = v.toString();
    return v.replace(/^(\d{5})(\d)/, "$1-$2").slice(0, 9);
  }

  formatPhone(v: any): string {
    if (!v) return '';
    v = v.toString();
    return v.length <= 10
      ? v.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2")
      : v.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
  }

  senhasIguais() {
    return (form: AbstractControl) => {
      const s1 = form.get('senha')?.value;
      const s2 = form.get('confirmarSenha')?.value;
      if (!s1 && !s2) return null;
      return s1 !== s2 ? { senhaMismatch: true } : null;
    };
  }

  showToast(message: string) {
    this.toastMessage = message;
    this.toastShow = true;
    setTimeout(() => { this.toastShow = false; }, 3000);
  }

  // --------- SENHA DINÂMICA (igual ao cadastro) ----------
  get senhaAtual() {
    return this.perfilForm.get('senha')?.value || '';
  }

  passwordRules = [
    { label: "Mínimo de 6 caracteres", check: () => this.senhaAtual.length >= 6 },
    { label: "Letra maiúscula", check: () => /[A-Z]/.test(this.senhaAtual) },
    { label: "Letra minúscula", check: () => /[a-z]/.test(this.senhaAtual) },
    { label: "Número", check: () => /[0-9]/.test(this.senhaAtual) },
    { label: "Caractere especial (!@#$%)", check: () => /[!@#$%^&*(),.?":{}|<>]/.test(this.senhaAtual) }
  ];
  // --------------------------------------------------------

  onSubmit() {
    if (!this.perfilForm.valid) {
      this.showToast('Formulário inválido.');
      return;
    }

    const payload = {
      email: this.perfilForm.get('email')?.value,
      telefone: this.perfilForm.get('telefone')?.value,
      endereco: this.perfilForm.get('endereco')?.value,
      cep: this.perfilForm.get('cep')?.value?.replace(/\D/g, ''),
      senha: this.perfilForm.get('senha')?.value || null,
    };

    const username = this.perfilForm.get('username')?.value;

    this.http.put(`http://localhost:8080/pessoas/update/${username}`, payload)
      .subscribe({
        next: (updatedProfile: any) => {
          this.showToast('Dados atualizados com sucesso!');
          sessionStorage.setItem('perfilData', JSON.stringify(updatedProfile));
          this.perfilService.atualizarPerfilLocal(updatedProfile);
          this.carregarDados(updatedProfile);
        },
        error: () => {
          this.showToast('Erro ao atualizar os dados.');
        }
      });
  }
}
