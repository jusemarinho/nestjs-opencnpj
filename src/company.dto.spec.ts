import { plainToInstance } from 'class-transformer';
import { CompanyDto, PhoneDto, PartnerDto } from './company.dto';

describe('CompanyDto', () => {
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

  it('should transform API response to CompanyDto correctly', () => {
    const dto = plainToInstance(CompanyDto, mockApiResponse, {
      excludeExtraneousValues: true,
    });

    expect(dto.cnpj).toBe('12345678000195');
    expect(dto.corporateName).toBe('Empresa Teste LTDA');
    expect(dto.tradeName).toBe('Empresa Teste');
    expect(dto.registrationStatus).toBe('ATIVA');
    expect(dto.registrationStatusDate).toBe('2020-01-01');
    expect(dto.headquarterOrBranch).toBe('MATRIZ');
    expect(dto.activityStartDate).toBe('2020-01-01');
    expect(dto.mainCnae).toBe('6201-5/00');
    expect(dto.secondaryCnaes).toEqual(['6202-3/00', '6203-1/00']);
    expect(dto.secondaryCnaesCount).toBe(2);
    expect(dto.legalNature).toBe('206-2');
    expect(dto.street).toBe('Rua Teste');
    expect(dto.number).toBe('123');
    expect(dto.complement).toBe('Sala 1');
    expect(dto.neighborhood).toBe('Centro');
    expect(dto.zipCode).toBe('12345678');
    expect(dto.state).toBe('SP');
    expect(dto.city).toBe('São Paulo');
    expect(dto.email).toBe('teste@empresa.com');
    expect(dto.shareCapital).toBe('100000.00');
    expect(dto.companySize).toBe('PEQUENO PORTE');
    expect(dto.simpleOption).toBe('SIM');
    expect(dto.simpleOptionDate).toBe('2020-01-01');
    expect(dto.meiOption).toBeNull();
    expect(dto.meiOptionDate).toBeNull();
  });

  it('should transform phones array correctly', () => {
    const dto = plainToInstance(CompanyDto, mockApiResponse, {
      excludeExtraneousValues: true,
    });

    expect(dto.phones).toHaveLength(2);
    expect(dto.phones[0]).toEqual({
      areaCode: '11',
      number: '12345678',
      isFax: false,
    });
    expect(dto.phones[1]).toEqual({
      areaCode: '11',
      number: '87654321',
      isFax: true,
    });
  });

  it('should transform partners array correctly', () => {
    const dto = plainToInstance(CompanyDto, mockApiResponse, {
      excludeExtraneousValues: true,
    });

    expect(dto.partners).toHaveLength(1);
    expect(dto.partners[0]).toEqual({
      name: 'João Silva',
      document: '12345678901',
      role: 'ADMINISTRADOR',
      entryDate: '2020-01-01',
      type: 'PESSOA FISICA',
      ageRange: '31-40',
    });
  });

  it('should handle missing optional fields', () => {
    const apiResponseWithoutOptionals = {
      cnpj: '12345678000195',
      razao_social: 'Empresa Teste LTDA',
      nome_fantasia: 'Empresa Teste',
      situacao_cadastral: 'ATIVA',
      data_situacao_cadastral: '2020-01-01',
      matriz_filial: 'MATRIZ',
      data_inicio_atividade: '2020-01-01',
      cnae_principal: '6201-5/00',
      natureza_juridica: '206-2',
      logradouro: 'Rua Teste',
      numero: '123',
      complemento: 'Sala 1',
      bairro: 'Centro',
      cep: '12345678',
      uf: 'SP',
      municipio: 'São Paulo',
      email: 'teste@empresa.com',
      capital_social: '100000.00',
      porte_empresa: 'PEQUENO PORTE',
    };

    const dto = plainToInstance(CompanyDto, apiResponseWithoutOptionals, {
      excludeExtraneousValues: true,
    });

    expect(dto.secondaryCnaes).toBeUndefined();
    expect(dto.secondaryCnaesCount).toBeUndefined();
    expect(dto.phones).toBeUndefined();
    expect(dto.partners).toBeUndefined();
    expect(dto.simpleOption).toBeUndefined();
    expect(dto.simpleOptionDate).toBeUndefined();
    expect(dto.meiOption).toBeUndefined();
    expect(dto.meiOptionDate).toBeUndefined();
  });

  it('should exclude extraneous values', () => {
    const apiResponseWithExtraFields = {
      ...mockApiResponse,
      extra_field: 'should be excluded',
      another_extra_field: 'should also be excluded',
    };

    const dto = plainToInstance(CompanyDto, apiResponseWithExtraFields, {
      excludeExtraneousValues: true,
    });

    expect((dto as any).extra_field).toBeUndefined();
    expect((dto as any).another_extra_field).toBeUndefined();
  });
});

describe('PhoneDto', () => {
  const mockPhoneApiResponse = {
    ddd: '11',
    numero: '12345678',
    is_fax: false,
  };

  it('should transform phone API response correctly', () => {
    const dto = plainToInstance(PhoneDto, mockPhoneApiResponse, {
      excludeExtraneousValues: true,
    });

    expect(dto.areaCode).toBe('11');
    expect(dto.number).toBe('12345678');
    expect(dto.isFax).toBe(false);
  });

  it('should handle fax phone', () => {
    const faxPhoneApiResponse = {
      ddd: '11',
      numero: '87654321',
      is_fax: true,
    };

    const dto = plainToInstance(PhoneDto, faxPhoneApiResponse, {
      excludeExtraneousValues: true,
    });

    expect(dto.areaCode).toBe('11');
    expect(dto.number).toBe('87654321');
    expect(dto.isFax).toBe(true);
  });
});

describe('PartnerDto', () => {
  const mockPartnerApiResponse = {
    nome_socio: 'João Silva',
    cnpj_cpf_socio: '12345678901',
    qualificacao_socio: 'ADMINISTRADOR',
    data_entrada_sociedade: '2020-01-01',
    identificador_socio: 'PESSOA FISICA',
    faixa_etaria: '31-40',
  };

  it('should transform partner API response correctly', () => {
    const dto = plainToInstance(PartnerDto, mockPartnerApiResponse, {
      excludeExtraneousValues: true,
    });

    expect(dto.name).toBe('João Silva');
    expect(dto.document).toBe('12345678901');
    expect(dto.role).toBe('ADMINISTRADOR');
    expect(dto.entryDate).toBe('2020-01-01');
    expect(dto.type).toBe('PESSOA FISICA');
    expect(dto.ageRange).toBe('31-40');
  });

  it('should handle different partner types', () => {
    const juridicalPersonApiResponse = {
      nome_socio: 'Empresa Parceira LTDA',
      cnpj_cpf_socio: '98765432000123',
      qualificacao_socio: 'SÓCIO',
      data_entrada_sociedade: '2021-01-01',
      identificador_socio: 'PESSOA JURIDICA',
      faixa_etaria: null,
    };

    const dto = plainToInstance(PartnerDto, juridicalPersonApiResponse, {
      excludeExtraneousValues: true,
    });

    expect(dto.name).toBe('Empresa Parceira LTDA');
    expect(dto.document).toBe('98765432000123');
    expect(dto.role).toBe('SÓCIO');
    expect(dto.entryDate).toBe('2021-01-01');
    expect(dto.type).toBe('PESSOA JURIDICA');
    expect(dto.ageRange).toBeNull();
  });
});
