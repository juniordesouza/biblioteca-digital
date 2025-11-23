import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-admin-register-user',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, AdminHeaderComponent],
  templateUrl: './admin-register-user.html',
  styleUrls: ['./admin-register-user.css']
})
export class AdminRegisterUserPage {

  constructor(
    private http: HttpClient,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  sidebarOpen = true;
  toggleSidebar() { this.sidebarOpen = !this.sidebarOpen; }

  /* ===========================
        POPUP DE SUCESSO
  ============================ */
  showPopup = false;
  popupMessage = "";
  popupSub = "";

  showSuccessPopup(username: string) {
    this.popupMessage = "Funcionário cadastrado com sucesso!";
    this.popupSub = `username: ${username} — cargo: FUNCIONARIO`;
    this.showPopup = true;

    setTimeout(() => {
      this.showPopup = false;
    }, 3000);
  }


  /* ===========================
       TOAST DE ERRO (LOGIN STYLE)
  ============================ */
  showAlert = false;
  alertMessage = "";

  showErrorToast(msg: string) {
    this.zone.run(() => {
      this.alertMessage = msg;
      this.showAlert = true;

      this.cdr.markForCheck();

      setTimeout(() => {
        this.zone.run(() => {
          this.showAlert = false;
          this.cdr.markForCheck();
        });
      }, 3500);
    });
  }


  /* ===========================
         FORM MODEL
  ============================ */

  user = {
    username: '',
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    cpf: '',
    endereco: '',
    sexo: 'M'
  };

  confirmarSenha: string = "";
  passwordsMatch: boolean = true;

  /* ===========================
         VALIDAÇÃO SENHA
  ============================ */

  validatePassword() {
    this.passwordsMatch = this.user.senha === this.confirmarSenha;
  }

  validatePasswordMatch() {
    this.passwordsMatch = this.user.senha === this.confirmarSenha;
  }

  passwordRules = [
    { label: "Mínimo de 8 caracteres", check: (v: string) => v.length >= 8 },
    { label: "Letra maiúscula", check: (v: string) => /[A-Z]/.test(v) },
    { label: "Letra minúscula", check: (v: string) => /[a-z]/.test(v) },
    { label: "Número", check: (v: string) => /[0-9]/.test(v) },
    { label: "Caractere especial", check: (v: string) => /[^A-Za-z0-9]/.test(v) }
  ];


  /* ===========================
         MÁSCARAS
  ============================ */

  maskCPF(model: NgModel) {
    let v = model.value.replace(/\D/g, "");
    if (v.length > 3) v = v.replace(/(\d{3})(\d)/, "$1.$2");
    if (v.length > 7) v = v.replace(/(\d{3})(\d)/, "$1.$2");
    if (v.length > 11) v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    this.user.cpf = v;
  }

  maskPhone(model: NgModel) {
    let v = model.value.replace(/\D/g, "");
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d{5})(\d)/, "$1-$2");
    this.user.telefone = v;
  }


  /* ===========================
        ENVIO BACKEND
  ============================ */

  onSubmit() {

    if (!this.passwordsMatch) {
      this.showErrorToast("As senhas não coincidem.");
      return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
      this.showErrorToast("Você precisa estar logado como ADMIN.");
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const payload = {
      ...this.user,
      cpf: this.user.cpf.replace(/\D/g, ""),
      telefone: this.user.telefone.replace(/\D/g, "")
    };

    this.http.post('http://localhost:8080/admin/cadastrar-funcionario', payload, { headers })
      .subscribe({
        next: (resp: any) => {
          this.showSuccessPopup(this.user.username);
          this.resetForm();
        },
        error: err => {
          console.error(err);

          const msg =
          err?.error?.erro ||
          err?.error?.mensagem ||
          "Erro ao cadastrar funcionário.";

          this.showErrorToast(msg);
        }
      });
  }


  /* ===========================
         RESET
  ============================ */

  resetForm() {
    this.user = {
      username: '',
      nome: '',
      email: '',
      senha: '',
      telefone: '',
      cpf: '',
      endereco: '',
      sexo: 'M'
    };
    this.confirmarSenha = "";
    this.passwordsMatch = true;
  }
}
