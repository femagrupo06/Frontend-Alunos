import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header';
import { AtividadeService } from '../../services/atividade.service';
import { RegistroForm } from '../../models/registro-form';

@Component({
  selector: 'app-professor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, ReactiveFormsModule],
  templateUrl: './professor.html',
  styleUrls: ['./professor.css'],
})
export class ProfessorComponent implements OnInit {
  atividadeForm!: FormGroup;

  sessions: any[] = [];
  mostrarToast = false;

  groupCount: number = 1;
  totalAlunos: number | null = null;
  mostrarCalculo = false;
  distribuicao: number[] = [];

  mostrarModalExcluir = false;
  sessionSelecionada: any = null;

  constructor(
    private fb: FormBuilder,
    private atividadeService: AtividadeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.atividadeForm = this.fb.group({
      descricaoAtividade: ['', [Validators.required, Validators.maxLength(100)]],
      quantidadeTotalGrupos: [null, [Validators.required, Validators.min(2)]],
      quantidadeTotalAlunosSala: [null, [Validators.required, Validators.min(2)]],
      grupoForm: this.fb.array([]),
    });

    this.atualizarGrupos();
  }

  get grupoForm(): FormArray {
    return this.atividadeForm.get('grupoForm') as FormArray;
  }

  bloquearCaracteresInvalidos(event: KeyboardEvent): void {
  const teclasPermitidas = ['Backspace', 'Tab', 'Enter', 'Delete', 'ArrowLeft', 'ArrowRight'];
  
  if (teclasPermitidas.includes(event.key)) {
    return;
  }

  if (!/^[0-9]$/.test(event.key)) {
    event.preventDefault();
  }
}

  atualizarGrupos(): void {
    const totalAlunos = this.atividadeForm.get('quantidadeTotalAlunosSala')?.value || 0;
    let totalGrupos = this.atividadeForm.get('quantidadeTotalGrupos')?.value || 0;

    if (totalAlunos > 0 && totalGrupos >= totalAlunos) {
      totalGrupos = totalAlunos - 1;
      totalGrupos = totalGrupos < 1 ? 1 : totalGrupos; 
      
      this.atividadeForm.get('quantidadeTotalGrupos')?.setValue(totalGrupos, { emitEvent: false });
    }

    this.grupoForm.clear();

    for (let i = 0; i < totalGrupos; i++) {
      this.grupoForm.push(
        this.fb.group({
          nomeGrupo: ['', Validators.required],
          atividade: [''], 
          quantidadeMaximaAluno: [0],
        }),
      );
    }

    if (totalGrupos > 0) {
      this.calcularDistribuicao();
      this.calcularDistribuicao2();
    } else {
      this.mostrarCalculo = false;
      this.distribuicao = [];
    }
  }

  calcularDistribuicao(): void {
    const totalAlunos = this.atividadeForm.get('quantidadeTotalAlunosSala')?.value || 0;
    const totalGrupos = this.atividadeForm.get('quantidadeTotalGrupos')?.value || 1;

    const base = Math.floor(totalAlunos / totalGrupos);
    const resto = totalAlunos % totalGrupos;

    this.grupoForm.controls.forEach((grupo, index) => {
      const quantidadeCalculada = base + (index < resto ? 1 : 0);

      grupo.patchValue({
        atividade: this.atividadeForm.get('descricaoAtividade')?.value, 
        quantidadeMaximaAluno: quantidadeCalculada,
      }, { emitEvent: false }); 
    });
  }

  calcularDistribuicao2(): void {
    const totalAlunos = this.atividadeForm.get('quantidadeTotalAlunosSala')?.value;
    const totalGrupos = this.atividadeForm.get('quantidadeTotalGrupos')?.value || 2;

    if (!totalAlunos || totalAlunos < 1) {
      this.mostrarCalculo = false;
      this.distribuicao = [];
      return;
    }

    const base = Math.floor(totalAlunos / totalGrupos);
    const sobra = totalAlunos % totalGrupos;

    this.distribuicao = Array.from({ length: totalGrupos }, (_, i) =>
      i < sobra ? base + 1 : base,
    );

    this.groupCount = totalGrupos;
    this.totalAlunos = totalAlunos;
    this.mostrarCalculo = true;
  }

  get baseAlunos(): string {
    return ((this.totalAlunos || 0) / this.groupCount).toFixed(2);
  }

  criarSessao(): void {
    if (this.atividadeForm.invalid) {
      this.atividadeForm.markAllAsTouched();
      return;
    }

    const payload: RegistroForm = {
      descricaoAtividade: this.atividadeForm.value.descricaoAtividade,
      quantidadeTotalAlunosSala: this.atividadeForm.value.quantidadeTotalAlunosSala,
      grupoForm: this.grupoForm.value,
    };

    this.mostrarToast = true;

    this.atividadeService.criarAtividade(payload).subscribe({
      next: () => {
        setTimeout(() => {
          this.router.navigate(['/professor/atividades']);
        }, 1500);
      },
      error: (err) => {
        console.error('Erro ao criar atividade', err);
        this.mostrarToast = false; 
      },
    });
  }
}