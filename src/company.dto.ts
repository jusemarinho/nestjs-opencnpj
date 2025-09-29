import { Expose, Type, Exclude } from "class-transformer";

@Exclude()
export class PhoneDto {
  @Expose({ name: "ddd" })
  areaCode: string;

  @Expose({ name: "numero" })
  number: string;

  @Expose({ name: "is_fax" })
  isFax: boolean;
}

@Exclude()
export class PartnerDto {
  @Expose({ name: "nome_socio" })
  name: string;

  @Expose({ name: "cnpj_cpf_socio" })
  document: string;

  @Expose({ name: "qualificacao_socio" })
  role: string;

  @Expose({ name: "data_entrada_sociedade" })
  entryDate: string;

  @Expose({ name: "identificador_socio" })
  type: string;

  @Expose({ name: "faixa_etaria" })
  ageRange: string;
}

@Exclude()
export class CompanyDto {
  @Expose()
  cnpj: string;

  @Expose({ name: "razao_social" })
  corporateName: string;

  @Expose({ name: "nome_fantasia" })
  tradeName: string;

  @Expose({ name: "situacao_cadastral" })
  registrationStatus: string;

  @Expose({ name: "data_situacao_cadastral" })
  registrationStatusDate: string;

  @Expose({ name: "matriz_filial" })
  headquarterOrBranch: string;

  @Expose({ name: "data_inicio_atividade" })
  activityStartDate: string;

  @Expose({ name: "cnae_principal" })
  mainCnae: string;

  @Expose({ name: "cnaes_secundarios" })
  secondaryCnaes: string[];

  @Expose({ name: "cnaes_secundarios_count" })
  secondaryCnaesCount: number;

  @Expose({ name: "natureza_juridica" })
  legalNature: string;

  @Expose({ name: "logradouro" })
  street: string;

  @Expose({ name: "numero" })
  number: string;

  @Expose({ name: "complemento" })
  complement: string;

  @Expose({ name: "bairro" })
  neighborhood: string;

  @Expose({ name: "cep" })
  zipCode: string;

  @Expose({ name: "uf" })
  state: string;

  @Expose({ name: "municipio" })
  city: string;

  @Expose()
  email: string;

  @Expose({ name: "telefones" })
  @Type(() => PhoneDto)
  phones: PhoneDto[];

  @Expose({ name: "capital_social" })
  shareCapital: string;

  @Expose({ name: "porte_empresa" })
  companySize: string;

  @Expose({ name: "opcao_simples" })
  simpleOption: string | null;

  @Expose({ name: "data_opcao_simples" })
  simpleOptionDate: string | null;

  @Expose({ name: "opcao_mei" })
  meiOption: string | null;

  @Expose({ name: "data_opcao_mei" })
  meiOptionDate: string | null;

  @Expose({ name: "QSA" })
  @Type(() => PartnerDto)
  partners: PartnerDto[];
}