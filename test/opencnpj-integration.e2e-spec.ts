import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { OpenCnpjModule } from '../src/opencnpj.module';
import { OpenCnpjService } from '../src/opencnpj.service';
import { CompanyDto } from '../src/company.dto';

describe('OpenCNPJ E2E Tests - Exemplo Real', () => {
  let app: INestApplication;
  let openCnpjService: OpenCnpjService;

  const mockCompanyDto: CompanyDto = {
    cnpj: '00000000000000',
    corporateName: 'EMPRESA EXEMPLO LTDA',
    tradeName: 'EXEMPLO',
    registrationStatus: 'Ativa',
    registrationStatusDate: '2000-01-01',
    headquarterOrBranch: 'Matriz',
    activityStartDate: '2000-01-01',
    mainCnae: '0000000',
    secondaryCnaes: ['0000001', '0000002'],
    secondaryCnaesCount: 2,
    legalNature: 'Sociedade Empresária Limitada',
    street: 'RUA EXEMPLO',
    number: '123',
    complement: 'SALA 1',
    neighborhood: 'BAIRRO EXEMPLO',
    zipCode: '00000000',
    state: 'SP',
    city: 'SAO PAULO',
    email: 'contato@exemplo.com',
    phones: [
      { areaCode: '11', number: '900000000', isFax: false },
    ],
    shareCapital: '1000,00',
    companySize: 'Microempresa (ME)',
    simpleOption: null,
    simpleOptionDate: null,
    meiOption: null,
    meiOptionDate: null,
    partners: [
      {
        name: 'SOCIO PJ EXEMPLO',
        document: '00000000000000',
        role: 'Sócio Pessoa Jurídica',
        entryDate: '2000-01-01',
        type: 'Pessoa Jurídica',
        ageRange: 'Não se aplica',
      },
      {
        name: 'SOCIA PF EXEMPLO',
        document: '***000000**',
        role: 'Administrador',
        entryDate: '2000-01-01',
        type: 'Pessoa Física',
        ageRange: '31 a 40 anos',
      },
    ],
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // Registrando o módulo normalmente, sem sobrescrever HttpModule
        OpenCnpjModule.register({}),
      ],
    })
      // Aqui injetamos um mock do HttpService do OpenCnpjService
      .overrideProvider(OpenCnpjService)
      .useValue({
        getCnpj: jest.fn().mockResolvedValue(mockCompanyDto),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    openCnpjService = moduleFixture.get<OpenCnpjService>(OpenCnpjService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should transform DTO to Company correctly', async () => {
    const result = await openCnpjService.getCnpj('00000000000000');

    expect(result).toBeDefined();
    expect(result.cnpj).toBe('00000000000000');
    expect(result.corporateName).toBe('EMPRESA EXEMPLO LTDA');
    expect(result.tradeName).toBe('EXEMPLO');
    expect(result.city).toBe('SAO PAULO');
    expect(result.state).toBe('SP');

    // Phones
    expect(result.phones).toHaveLength(1);
    expect(result.phones[0].areaCode).toBe('11');
    expect(result.phones[0].number).toBe('900000000');
    expect(result.phones[0].isFax).toBe(false);

    // Partners
    expect(result.partners).toHaveLength(2);
    expect(result.partners[0].name).toBe('SOCIO PJ EXEMPLO');
    expect(result.partners[1].name).toBe('SOCIA PF EXEMPLO');
  });
});