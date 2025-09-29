import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { OpenCnpjService } from './opencnpj.service';
import { AxiosHeaders } from 'axios';

describe('OpenCnpjService', () => {
  let service: OpenCnpjService;
  let httpService: HttpService;

  const mockApiResponse = {
    cnpj: '12345678000195',
    razao_social: 'Empresa Teste LTDA',
    nome_fantasia: 'Empresa Teste',
    situacao_cadastral: 'ATIVA',
    data_situacao_cadastral: '2020-01-01',
    matriz_filial: 'MATRIZ',
    data_inicio_atividade: '2020-01-01',
    cnae_principal: '6201-5/00',
    cnaes_secundarios: ['6202-3/00', '6203-1/00'],
    cnaes_secundarios_count: 2,
    natureza_juridica: '206-2',
    logradouro: 'Rua Teste',
    numero: '123',
    complemento: 'Sala 1',
    bairro: 'Centro',
    cep: '12345678',
    uf: 'SP',
    municipio: 'São Paulo',
    email: 'teste@empresa.com',
    telefones: [
      {
        ddd: '11',
        numero: '12345678',
        is_fax: false,
      },
      {
        ddd: '11',
        numero: '87654321',
        is_fax: true,
      },
    ],
    capital_social: '100000.00',
    porte_empresa: 'PEQUENO PORTE',
    opcao_simples: 'SIM',
    data_opcao_simples: '2020-01-01',
    opcao_mei: null,
    data_opcao_mei: null,
    QSA: [
      {
        nome_socio: 'João Silva',
        cnpj_cpf_socio: '12345678901',
        qualificacao_socio: 'ADMINISTRADOR',
        data_entrada_sociedade: '2020-01-01',
        identificador_socio: 'PESSOA FISICA',
        faixa_etaria: '31-40',
      },
    ],
  };

  const mockHttpResponse = {
    data: mockApiResponse,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {
      headers: new AxiosHeaders(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenCnpjService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OpenCnpjService>(OpenCnpjService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCnpj', () => {
    it('should reject invalid CNPJ before calling API', async () => {
      const spy = jest.spyOn(httpService, 'get');
      await expect(service.getCnpj('invalid-cnpj')).rejects.toThrow('Invalid CNPJ');
      expect(spy).not.toHaveBeenCalled();
    });

    it('should return company information for valid CNPJ', async () => {
      const cnpj = '12345678000195';
      jest.spyOn(httpService, 'get').mockReturnValue(of(mockHttpResponse));

      const result = await service.getCnpj(cnpj);

      expect(httpService.get).toHaveBeenCalledWith(`/${cnpj}`);
      expect(result).toEqual({
        cnpj: '12345678000195',
        corporateName: 'Empresa Teste LTDA',
        tradeName: 'Empresa Teste',
        registrationStatus: 'ATIVA',
        registrationStatusDate: '2020-01-01',
        headquarterOrBranch: 'MATRIZ',
        activityStartDate: '2020-01-01',
        mainCnae: '6201-5/00',
        secondaryCnaes: ['6202-3/00', '6203-1/00'],
        secondaryCnaesCount: 2,
        legalNature: '206-2',
        street: 'Rua Teste',
        number: '123',
        complement: 'Sala 1',
        neighborhood: 'Centro',
        zipCode: '12345678',
        state: 'SP',
        city: 'São Paulo',
        email: 'teste@empresa.com',
        phones: [
          {
            areaCode: '11',
            number: '12345678',
            isFax: false,
          },
          {
            areaCode: '11',
            number: '87654321',
            isFax: true,
          },
        ],
        shareCapital: '100000.00',
        companySize: 'PEQUENO PORTE',
        simpleOption: 'SIM',
        simpleOptionDate: '2020-01-01',
        meiOption: null,
        meiOptionDate: null,
        partners: [
          {
            name: 'João Silva',
            document: '12345678901',
            role: 'ADMINISTRADOR',
            entryDate: '2020-01-01',
            type: 'PESSOA FISICA',
            ageRange: '31-40',
          },
        ],
      });
    });

    it('should handle empty secondary CNAEs', async () => {
      const cnpj = '12345678000195';
      const apiResponseWithEmptySecondaryCnaes = {
        ...mockApiResponse,
        cnaes_secundarios: null,
        cnaes_secundarios_count: null,
      };
      const httpResponse = {
        ...mockHttpResponse,
        data: apiResponseWithEmptySecondaryCnaes,
      };
      
      jest.spyOn(httpService, 'get').mockReturnValue(of(httpResponse));

      const result = await service.getCnpj(cnpj);

      expect(result.secondaryCnaes).toEqual([]);
      expect(result.secondaryCnaesCount).toBe(0);
    });

    it('should handle empty phones array', async () => {
      const cnpj = '12345678000195';
      const apiResponseWithEmptyPhones = {
        ...mockApiResponse,
        telefones: null,
      };
      const httpResponse = {
        ...mockHttpResponse,
        data: apiResponseWithEmptyPhones,
      };
      
      jest.spyOn(httpService, 'get').mockReturnValue(of(httpResponse));

      const result = await service.getCnpj(cnpj);

      expect(result.phones).toEqual([]);
    });

    it('should handle empty partners array', async () => {
      const cnpj = '12345678000195';
      const apiResponseWithEmptyPartners = {
        ...mockApiResponse,
        QSA: null,
      };
      const httpResponse = {
        ...mockHttpResponse,
        data: apiResponseWithEmptyPartners,
      };
      
      jest.spyOn(httpService, 'get').mockReturnValue(of(httpResponse));

      const result = await service.getCnpj(cnpj);

      expect(result.partners).toEqual([]);
    });

    it('should handle null simple option fields', async () => {
      const cnpj = '12345678000195';
      const apiResponseWithNullSimpleOption = {
        ...mockApiResponse,
        opcao_simples: null,
        data_opcao_simples: null,
      };
      const httpResponse = {
        ...mockHttpResponse,
        data: apiResponseWithNullSimpleOption,
      };
      
      jest.spyOn(httpService, 'get').mockReturnValue(of(httpResponse));

      const result = await service.getCnpj(cnpj);

      expect(result.simpleOption).toBeNull();
      expect(result.simpleOptionDate).toBeNull();
    });

    it('should handle null MEI option fields', async () => {
      const cnpj = '12345678000195';
      const apiResponseWithNullMeiOption = {
        ...mockApiResponse,
        opcao_mei: null,
        data_opcao_mei: null,
      };
      const httpResponse = {
        ...mockHttpResponse,
        data: apiResponseWithNullMeiOption,
      };
      
      jest.spyOn(httpService, 'get').mockReturnValue(of(httpResponse));

      const result = await service.getCnpj(cnpj);

      expect(result.meiOption).toBeNull();
      expect(result.meiOptionDate).toBeNull();
    });

    it('should map 404 to NotFoundException', async () => {
      const cnpj = '12345678000195';
      const axiosLikeError: any = {
        response: { status: 404, data: { message: 'not found' } },
        message: 'Request failed with status code 404',
      };
      jest.spyOn(httpService, 'get').mockImplementation(() => { throw axiosLikeError; });

      await expect(service.getCnpj(cnpj)).rejects.toThrow('CNPJ not found');
    });

    it('should map 5xx to ServiceUnavailableException', async () => {
      const cnpj = '12345678000195';
      const axiosLikeError: any = {
        response: { status: 503, data: { message: 'unavailable' } },
        message: 'Request failed with status code 503',
      };
      jest.spyOn(httpService, 'get').mockImplementation(() => { throw axiosLikeError; });

      await expect(service.getCnpj(cnpj)).rejects.toThrow('OpenCNPJ service unavailable');
    });

    it('should rethrow non-http errors', async () => {
      const cnpj = '12345678000195';
      const nonHttpError = new Error('boom');
      jest.spyOn(httpService, 'get').mockImplementation(() => { throw nonHttpError; });

      await expect(service.getCnpj(cnpj)).rejects.toThrow('boom');
    });
  });
});
