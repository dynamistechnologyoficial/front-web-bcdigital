import dayjs from 'dayjs/esm';

export interface IPessoa {
  id: number;
  foto?: string | null;
  fotoContentType?: string | null;
  nome?: string | null;
  dtNascimento?: dayjs.Dayjs | null;
  cpf?: string | null;
  email?: string | null;
}

export type NewPessoa = Omit<IPessoa, 'id'> & { id: null };
