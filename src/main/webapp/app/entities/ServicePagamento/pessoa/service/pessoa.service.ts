import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPessoa, NewPessoa } from '../pessoa.model';

export type PartialUpdatePessoa = Partial<IPessoa> & Pick<IPessoa, 'id'>;

type RestOf<T extends IPessoa | NewPessoa> = Omit<T, 'dtNascimento'> & {
  dtNascimento?: string | null;
};

export type RestPessoa = RestOf<IPessoa>;

export type NewRestPessoa = RestOf<NewPessoa>;

export type PartialUpdateRestPessoa = RestOf<PartialUpdatePessoa>;

export type EntityResponseType = HttpResponse<IPessoa>;
export type EntityArrayResponseType = HttpResponse<IPessoa[]>;

@Injectable({ providedIn: 'root' })
export class PessoaService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pessoas', 'servicepagamento');

  create(pessoa: NewPessoa): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pessoa);
    return this.http
      .post<RestPessoa>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(pessoa: IPessoa): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pessoa);
    return this.http
      .put<RestPessoa>(`${this.resourceUrl}/${this.getPessoaIdentifier(pessoa)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(pessoa: PartialUpdatePessoa): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pessoa);
    return this.http
      .patch<RestPessoa>(`${this.resourceUrl}/${this.getPessoaIdentifier(pessoa)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPessoa>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPessoa[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPessoaIdentifier(pessoa: Pick<IPessoa, 'id'>): number {
    return pessoa.id;
  }

  comparePessoa(o1: Pick<IPessoa, 'id'> | null, o2: Pick<IPessoa, 'id'> | null): boolean {
    return o1 && o2 ? this.getPessoaIdentifier(o1) === this.getPessoaIdentifier(o2) : o1 === o2;
  }

  addPessoaToCollectionIfMissing<Type extends Pick<IPessoa, 'id'>>(
    pessoaCollection: Type[],
    ...pessoasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const pessoas: Type[] = pessoasToCheck.filter(isPresent);
    if (pessoas.length > 0) {
      const pessoaCollectionIdentifiers = pessoaCollection.map(pessoaItem => this.getPessoaIdentifier(pessoaItem));
      const pessoasToAdd = pessoas.filter(pessoaItem => {
        const pessoaIdentifier = this.getPessoaIdentifier(pessoaItem);
        if (pessoaCollectionIdentifiers.includes(pessoaIdentifier)) {
          return false;
        }
        pessoaCollectionIdentifiers.push(pessoaIdentifier);
        return true;
      });
      return [...pessoasToAdd, ...pessoaCollection];
    }
    return pessoaCollection;
  }

  protected convertDateFromClient<T extends IPessoa | NewPessoa | PartialUpdatePessoa>(pessoa: T): RestOf<T> {
    return {
      ...pessoa,
      dtNascimento: pessoa.dtNascimento?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restPessoa: RestPessoa): IPessoa {
    return {
      ...restPessoa,
      dtNascimento: restPessoa.dtNascimento ? dayjs(restPessoa.dtNascimento) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPessoa>): HttpResponse<IPessoa> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPessoa[]>): HttpResponse<IPessoa[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
