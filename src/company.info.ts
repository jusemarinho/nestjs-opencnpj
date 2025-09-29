export interface Phone {
  areaCode: string;
  number: string;
  isFax: boolean;
}

export interface Partner {
  name: string;
  document: string; // CNPJ or CPF
  role: string;
  entryDate: string; // ISO Date
  type: string; // Legal Entity | Individual
  ageRange: string;
}

export interface Company {
  cnpj: string;
  corporateName: string;
  tradeName: string;
  registrationStatus: string;
  registrationStatusDate: string; // ISO Date
  headquarterOrBranch: string;
  activityStartDate: string; // ISO Date
  mainCnae: string;
  secondaryCnaes: string[];
  secondaryCnaesCount: number;
  legalNature: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  zipCode: string;
  state: string;
  city: string;
  email: string;
  phones: Phone[];
  shareCapital: string;
  companySize: string;
  simpleOption: string | null;
  simpleOptionDate: string | null;
  meiOption: string | null;
  meiOptionDate: string | null;
  partners: Partner[];
}