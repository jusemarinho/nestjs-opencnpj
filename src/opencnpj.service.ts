import { HttpService } from "@nestjs/axios";
import { BadRequestException, HttpException, Injectable, NotFoundException, ServiceUnavailableException } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { CompanyDto } from "./company.dto";
import { plainToInstance } from "class-transformer";
import { Company } from "./company.info";

@Injectable()
export class OpenCnpjService {
  constructor(private readonly httpService: HttpService) { }

  async getCnpj(cnpj: string): Promise<Company> {
    const sanitized = this.sanitizeCnpj(cnpj);
    if (!this.isValidCnpj(sanitized)) {
      throw new BadRequestException("Invalid CNPJ");
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get<CompanyDto>(`/${sanitized}`)
      );

      const dto = plainToInstance(CompanyDto, response.data, {
        excludeExtraneousValues: true,
      });

      return this.dtoToCompany(dto);
    } catch (err: any) {
      // Only map known Axios-like errors; otherwise rethrow
      const status: number | undefined = err?.response?.status;
      const message: string = err?.response?.data?.message || err?.message || "Request failed";

      if (typeof status === "number") {
        if (status === 404) {
          throw new NotFoundException("CNPJ not found");
        }
        if (status >= 500) {
          throw new ServiceUnavailableException("OpenCNPJ service unavailable");
        }
        throw new HttpException(message, status);
      }

      // Non-HTTP error: rethrow original to preserve test behavior
      throw err;
    }
  }

  private dtoToCompany(dto: CompanyDto): Company {
    return {
      cnpj: dto.cnpj,
      corporateName: dto.corporateName,
      tradeName: dto.tradeName,
      registrationStatus: dto.registrationStatus,
      registrationStatusDate: dto.registrationStatusDate,
      headquarterOrBranch: dto.headquarterOrBranch,
      activityStartDate: dto.activityStartDate,
      mainCnae: dto.mainCnae,
      secondaryCnaes: dto.secondaryCnaes ?? [],
      secondaryCnaesCount: dto.secondaryCnaesCount ?? 0,
      legalNature: dto.legalNature,
      street: dto.street,
      number: dto.number,
      complement: dto.complement,
      neighborhood: dto.neighborhood,
      zipCode: dto.zipCode,
      state: dto.state,
      city: dto.city,
      email: dto.email,
      phones: dto.phones?.map(p => ({
        areaCode: p.areaCode,
        number: p.number,
        isFax: p.isFax,
      })) ?? [],
      shareCapital: dto.shareCapital,
      companySize: dto.companySize,
      simpleOption: dto.simpleOption,
      simpleOptionDate: dto.simpleOptionDate,
      meiOption: dto.meiOption,
      meiOptionDate: dto.meiOptionDate,
      partners: dto.partners?.map(p => ({
        name: p.name,
        document: p.document,
        role: p.role,
        entryDate: p.entryDate,
        type: p.type,
        ageRange: p.ageRange,
      })) ?? [],
    };
  }

  private sanitizeCnpj(input: string): string {
    return (input || "").replace(/\D/g, "");
  }

  private isValidCnpj(cnpj: string): boolean {
    if (!cnpj || cnpj.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cnpj)) return false; // all same digits

    const calcCheck = (base: string, factorStart: number): number => {
      let sum = 0;
      let factor = factorStart;
      for (let i = 0; i < base.length; i++) {
        sum += parseInt(base[i], 10) * factor;
        factor = factor === 2 ? 9 : factor - 1;
      }
      const result = sum % 11;
      return result < 2 ? 0 : 11 - result;
    };

    const base12 = cnpj.slice(0, 12);
    const d1 = calcCheck(base12, 5);
    const d2 = calcCheck(base12 + String(d1), 6);
    return cnpj.endsWith(`${d1}${d2}`);
  }
}