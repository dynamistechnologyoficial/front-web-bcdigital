import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IPessoa, NewPessoa } from '../pessoa.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPessoa for edit and NewPessoaFormGroupInput for create.
 */
type PessoaFormGroupInput = IPessoa | PartialWithRequiredKeyOf<NewPessoa>;

type PessoaFormDefaults = Pick<NewPessoa, 'id'>;

type PessoaFormGroupContent = {
  id: FormControl<IPessoa['id'] | NewPessoa['id']>;
  foto: FormControl<IPessoa['foto']>;
  fotoContentType: FormControl<IPessoa['fotoContentType']>;
  nome: FormControl<IPessoa['nome']>;
  dtNascimento: FormControl<IPessoa['dtNascimento']>;
  cpf: FormControl<IPessoa['cpf']>;
  email: FormControl<IPessoa['email']>;
};

export type PessoaFormGroup = FormGroup<PessoaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PessoaFormService {
  createPessoaFormGroup(pessoa: PessoaFormGroupInput = { id: null }): PessoaFormGroup {
    const pessoaRawValue = {
      ...this.getFormDefaults(),
      ...pessoa,
    };
    return new FormGroup<PessoaFormGroupContent>({
      id: new FormControl(
        { value: pessoaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      foto: new FormControl(pessoaRawValue.foto),
      fotoContentType: new FormControl(pessoaRawValue.fotoContentType),
      nome: new FormControl(pessoaRawValue.nome, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(510)],
      }),
      dtNascimento: new FormControl(pessoaRawValue.dtNascimento, {
        validators: [Validators.required],
      }),
      cpf: new FormControl(pessoaRawValue.cpf, {
        validators: [Validators.required, Validators.pattern('([0-9]{3}\\.?[0-9]{3}\\.?[0-9]{3}\\-?([0-9]){2})')],
      }),
      email: new FormControl(pessoaRawValue.email, {
        validators: [Validators.required, Validators.pattern('(^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$)')],
      }),
    });
  }

  getPessoa(form: PessoaFormGroup): IPessoa | NewPessoa {
    return form.getRawValue() as IPessoa | NewPessoa;
  }

  resetForm(form: PessoaFormGroup, pessoa: PessoaFormGroupInput): void {
    const pessoaRawValue = { ...this.getFormDefaults(), ...pessoa };
    form.reset(
      {
        ...pessoaRawValue,
        id: { value: pessoaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PessoaFormDefaults {
    return {
      id: null,
    };
  }
}
