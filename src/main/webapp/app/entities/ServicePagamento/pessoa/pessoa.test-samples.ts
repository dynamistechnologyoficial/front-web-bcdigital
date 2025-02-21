import dayjs from 'dayjs/esm';

import { IPessoa, NewPessoa } from './pessoa.model';

export const sampleWithRequiredData: IPessoa = {
  id: 3727,
  nome: 'aw accept',
  dtNascimento: dayjs('2025-02-09'),
  cpf: '306.258953-20',
  email: 'L30S0V@5HY.b4Cc.l0A.J2.l9',
};

export const sampleWithPartialData: IPessoa = {
  id: 10056,
  nome: 'woefully',
  dtNascimento: dayjs('2025-02-09'),
  cpf: '800.428.786-79',
  email: 'mRyd3U@cOE.igdmqX.Gn',
};

export const sampleWithFullData: IPessoa = {
  id: 10706,
  foto: '../fake-data/blob/hipster.png',
  fotoContentType: 'unknown',
  nome: 'overwork after stark',
  dtNascimento: dayjs('2025-02-09'),
  cpf: '245661.855-20',
  email: 'T01FJm@dAM.OPU0Yd.Dmp.oO.w98',
};

export const sampleWithNewData: NewPessoa = {
  nome: 'even',
  dtNascimento: dayjs('2025-02-09'),
  cpf: '43859632313',
  email: '8u@B.F9.m0xos1.kb.y8O.Q3f8-Q.XU',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
