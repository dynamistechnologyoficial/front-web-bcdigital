import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../pessoa.test-samples';

import { PessoaFormService } from './pessoa-form.service';

describe('Pessoa Form Service', () => {
  let service: PessoaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PessoaFormService);
  });

  describe('Service methods', () => {
    describe('createPessoaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPessoaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            foto: expect.any(Object),
            nome: expect.any(Object),
            dtNascimento: expect.any(Object),
            cpf: expect.any(Object),
            email: expect.any(Object),
          }),
        );
      });

      it('passing IPessoa should create a new form with FormGroup', () => {
        const formGroup = service.createPessoaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            foto: expect.any(Object),
            nome: expect.any(Object),
            dtNascimento: expect.any(Object),
            cpf: expect.any(Object),
            email: expect.any(Object),
          }),
        );
      });
    });

    describe('getPessoa', () => {
      it('should return NewPessoa for default Pessoa initial value', () => {
        const formGroup = service.createPessoaFormGroup(sampleWithNewData);

        const pessoa = service.getPessoa(formGroup) as any;

        expect(pessoa).toMatchObject(sampleWithNewData);
      });

      it('should return NewPessoa for empty Pessoa initial value', () => {
        const formGroup = service.createPessoaFormGroup();

        const pessoa = service.getPessoa(formGroup) as any;

        expect(pessoa).toMatchObject({});
      });

      it('should return IPessoa', () => {
        const formGroup = service.createPessoaFormGroup(sampleWithRequiredData);

        const pessoa = service.getPessoa(formGroup) as any;

        expect(pessoa).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPessoa should not enable id FormControl', () => {
        const formGroup = service.createPessoaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPessoa should disable id FormControl', () => {
        const formGroup = service.createPessoaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
