import { Routes } from '@angular/router';
import { ValidarIdentidadeComponent } from './pages/aluno/validar-identidade/validar-identidade';
import { AtividadeGruposComponent } from './features/professor/atividade-grupos/atividade-grupos';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home')
        .then(m => m.Home)
  },

  {
    path: 'professor',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/professor/professor')
            .then(m => m.ProfessorComponent)
      },
      {
        path: 'atividades',
        component: AtividadeGruposComponent
      },
      {
        path: 'atividades/qrcodes', 
        loadComponent: () =>
          import('./features/professor/qrcodes/qrcodes')
            .then(m => m.QRCodesComponent)
      },
      {
        path: 'sessao/:id',
        loadComponent: () =>
          import('./pages/aluno/sessao-grupos/sessao-grupos')
            .then(m => m.SessaoGruposComponent)
      }
    ]
  },

  {
    path: 'aluno',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/aluno/entrar-sessao/entrar-sessao')
            .then(m => m.EntrarSessaoComponent)
      },
      {
        path: 'validar',
        component: ValidarIdentidadeComponent
      },
      {
        path: 'grupos',
        loadComponent: () =>
          import('./pages/aluno/sessao-grupos/sessao-grupos')
            .then(m => m.SessaoGruposComponent)
      }
    ]
  }, 
  
  {
    path: 'sobre',
    loadComponent: () =>
      import('./pages/sobre/sobre')
        .then(m => m.SobreComponent)
  }
];