<h1 align="center">nestjs-opencnpj</h1>

<div align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo_text.svg" width="140" alt="Nest Logo" />
  </a>
</div>

<p align="center">NestJS library to fetch Brazilian CNPJ company data via OpenCNPJ.</p>

<div align="center">
  <img src="https://img.shields.io/badge/built%20with-NestJS-E0234E" alt="Built with NestJS">
  <img src="https://img.shields.io/badge/language-TypeScript-3178C6" alt="TypeScript">
</div>

## Installation

```bash
npm install nestjs-opencnpj
# or
yarn add nestjs-opencnpj
```

## What’s included

- `OpenCnpjModule` to configure the HTTP client
- `OpenCnpjService` with `getCnpj(cnpj: string)`
- Exported types: `Company`, `Phone`, `Partner`

## Quick start

1) Register the module in your `AppModule` (or any feature module):

```ts
import { Module } from '@nestjs/common';
import { OpenCnpjModule } from 'nestjs-opencnpj';

@Module({
  imports: [
    // Uses internal HttpModule with default baseURL (https://api.opencnpj.org)
    OpenCnpjModule.register({}),
  ],
})
export class AppModule {}
```

2) Inject the service and query a CNPJ:

```ts
import { Injectable } from '@nestjs/common';
import { OpenCnpjService, Company } from 'nestjs-opencnpj';

@Injectable()
export class CompanyService {
  constructor(private readonly openCnpj: OpenCnpjService) {}

  async findByCnpj(cnpj: string): Promise<Company> {
    return this.openCnpj.getCnpj(cnpj);
  }
}
```

## Advanced configuration (custom HttpModule)

If you already have a custom `HttpModule` (timeouts, headers, proxy, different baseURL), you can provide it:

```ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OpenCnpjModule } from 'nestjs-opencnpj';

@Module({
  imports: [
    OpenCnpjModule.register({
      httpModule: HttpModule.register({
        timeout: 10_000,
        maxRedirects: 5,
        baseURL: 'https://api.opencnpj.org',
        // headers: { Authorization: `Bearer ...` },
      }),
    }),
  ],
})
export class AppModule {}
```

## Async registration (registerAsync)

Configure the underlying `HttpModule` asynchronously (e.g., load env vars via a config service).

### 1) Provide your own async HttpModule

```ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OpenCnpjModule } from 'nestjs-opencnpj';

@Module({
  imports: [
    OpenCnpjModule.registerAsync({
      httpModuleAsync: {
        useFactory: async () => ({
          baseURL: 'https://api.opencnpj.org',
          timeout: 10_000,
          maxRedirects: 5,
        }),
      },
    }),
  ],
})
export class AppModule {}
```

### 2) No async options provided

If you don’t pass `httpModuleAsync`, the module uses the same default configuration as the sync `register` method via `HttpModule.register`:

- `baseURL`: `https://api.opencnpj.org`
- `timeout`: 10_000 ms
- `maxRedirects`: 5

If you don’t pass `httpModule`, the lib registers an internal one with:
- `baseURL`: `https://api.opencnpj.org`
- `timeout`: 10s
- `maxRedirects`: 5

## Exports

```ts
import {
  Company,
  Phone,
  Partner,
  OpenCnpjService,
  OpenCnpjModule,
} from 'nestjs-opencnpj';
```

`Company` is the simplified shape returned by the service, already transformed from the OpenCNPJ payload (via `class-transformer`).

## Error handling

The service sanitizes and validates input before calling the API and maps common upstream errors:

- Invalid CNPJ (wrong length, all same digits, invalid check digits) → throws `BadRequestException("Invalid CNPJ")` without calling the API
- Upstream 404 → throws `NotFoundException("CNPJ not found")`
- Upstream 5xx → throws `ServiceUnavailableException("OpenCNPJ service unavailable")`
- Other HTTP statuses → throws `HttpException` with the upstream status/message
- Non-HTTP errors are rethrown unchanged

```ts
try {
  const company = await this.openCnpj.getCnpj('11222333000181');
  // ...
} catch (err) {
  // examples:
  // - err instanceof BadRequestException  // invalid CNPJ
  // - err instanceof NotFoundException    // 404 from API
  // - err instanceof ServiceUnavailableException // 5xx from API
  // - err instanceof HttpException        // other mapped HTTP errors
}
```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

MIT — see [LICENSE](LICENSE).