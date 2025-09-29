import { DynamicModule, Module } from "@nestjs/common";
import { OpenCnpjAsyncOptions, OpenCnpjConfig } from "./config/opencnpj.config";
import { HttpModule } from "@nestjs/axios";
import { API_URL } from "./constants";
import { OpenCnpjService } from "./opencnpj.service";

@Module({})
export class OpenCnpjModule {
  static register(openCnpjConfig?: OpenCnpjConfig): DynamicModule {
    const imports = [];

    if (!openCnpjConfig?.httpModule) {
      imports.push(
        HttpModule.register({
          timeout: 10_000, // 10 seconds
          maxRedirects: 5,
          baseURL: API_URL,
        }),
      );
    } else {
      imports.push(openCnpjConfig.httpModule);
    }

    return {
      module: OpenCnpjModule,
      imports: imports,
      providers: [OpenCnpjService],
      exports: [OpenCnpjService]
    }
  }

  static registerAsync(options: OpenCnpjAsyncOptions): DynamicModule {
    const imports = [];

    if (options?.httpModuleAsync) {
      imports.push(HttpModule.registerAsync(options.httpModuleAsync));
    } else {
      imports.push(
        HttpModule.register({
          timeout: 10_000,
          maxRedirects: 5,
          baseURL: API_URL,
        })
      );
    }

    return {
      module: OpenCnpjModule,
      imports,
      providers: [OpenCnpjService],
      exports: [OpenCnpjService],
    };
  }
}