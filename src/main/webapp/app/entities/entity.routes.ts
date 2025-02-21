import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'pessoa',
    data: { pageTitle: 'frontWebBcdigitalApp.servicePagamentoPessoa.home.title' },
    loadChildren: () => import('./ServicePagamento/pessoa/pessoa.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
