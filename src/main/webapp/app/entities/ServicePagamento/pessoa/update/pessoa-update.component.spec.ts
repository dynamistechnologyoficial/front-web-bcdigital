import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { PessoaService } from '../service/pessoa.service';
import { IPessoa } from '../pessoa.model';
import { PessoaFormService } from './pessoa-form.service';

import { PessoaUpdateComponent } from './pessoa-update.component';

describe('Pessoa Management Update Component', () => {
  let comp: PessoaUpdateComponent;
  let fixture: ComponentFixture<PessoaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pessoaFormService: PessoaFormService;
  let pessoaService: PessoaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PessoaUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PessoaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PessoaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pessoaFormService = TestBed.inject(PessoaFormService);
    pessoaService = TestBed.inject(PessoaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const pessoa: IPessoa = { id: 896 };

      activatedRoute.data = of({ pessoa });
      comp.ngOnInit();

      expect(comp.pessoa).toEqual(pessoa);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPessoa>>();
      const pessoa = { id: 22174 };
      jest.spyOn(pessoaFormService, 'getPessoa').mockReturnValue(pessoa);
      jest.spyOn(pessoaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pessoa });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pessoa }));
      saveSubject.complete();

      // THEN
      expect(pessoaFormService.getPessoa).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(pessoaService.update).toHaveBeenCalledWith(expect.objectContaining(pessoa));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPessoa>>();
      const pessoa = { id: 22174 };
      jest.spyOn(pessoaFormService, 'getPessoa').mockReturnValue({ id: null });
      jest.spyOn(pessoaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pessoa: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pessoa }));
      saveSubject.complete();

      // THEN
      expect(pessoaFormService.getPessoa).toHaveBeenCalled();
      expect(pessoaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPessoa>>();
      const pessoa = { id: 22174 };
      jest.spyOn(pessoaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pessoa });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pessoaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
