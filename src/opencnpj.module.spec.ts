import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { OpenCnpjModule } from './opencnpj.module';
import { OpenCnpjAsyncOptions, OpenCnpjConfig } from './config/opencnpj.config';
import { API_URL } from './constants';
import { OpenCnpjService } from './opencnpj.service';

describe('OpenCnpjModule', () => {
  let module: TestingModule;

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  describe('register', () => {
    it('should create module with default HttpModule when no httpModule provided', () => {
      const config: OpenCnpjConfig = {};
      
      const dynamicModule = OpenCnpjModule.register(config);

      expect(dynamicModule.module).toBe(OpenCnpjModule);
      expect(dynamicModule.imports).toHaveLength(1);
      expect(dynamicModule.providers).toEqual([OpenCnpjService]);
      expect(dynamicModule.exports).toEqual([OpenCnpjService]);
    });

    it('should create module with custom HttpModule when provided', () => {
      const customHttpModule = HttpModule.register({
        timeout: 5_000,
        baseURL: 'https://custom.api.url',
      });
      
      const config: OpenCnpjConfig = {
        httpModule: customHttpModule,
      };
      
      const dynamicModule = OpenCnpjModule.register(config);

      expect(dynamicModule.module).toBe(OpenCnpjModule);
      expect(dynamicModule.imports).toEqual([customHttpModule]);
      expect(dynamicModule.providers).toEqual([OpenCnpjService]);
      expect(dynamicModule.exports).toEqual([OpenCnpjService]);
    });

    it('should create module with null httpModule', () => {
      const config: OpenCnpjConfig = {
        httpModule: null,
      };
      
      const dynamicModule = OpenCnpjModule.register(config);

      expect(dynamicModule.module).toBe(OpenCnpjModule);
      expect(dynamicModule.imports).toHaveLength(1);
      expect(dynamicModule.providers).toEqual([OpenCnpjService]);
      expect(dynamicModule.exports).toEqual([OpenCnpjService]);
    });

    it('should create module with undefined httpModule', () => {
      const config: OpenCnpjConfig = {
        httpModule: undefined,
      };
      
      const dynamicModule = OpenCnpjModule.register(config);

      expect(dynamicModule.module).toBe(OpenCnpjModule);
      expect(dynamicModule.imports).toHaveLength(1);
      expect(dynamicModule.providers).toEqual([OpenCnpjService]);
      expect(dynamicModule.exports).toEqual([OpenCnpjService]);
    });
  });

  describe('module integration', () => {
    it('should compile successfully with default configuration', async () => {
      const config: OpenCnpjConfig = {};
      
      module = await Test.createTestingModule({
        imports: [OpenCnpjModule.register(config)],
      }).compile();

      expect(module).toBeDefined();
      expect(module.get(OpenCnpjModule)).toBeDefined();
    });

    it('should compile successfully with custom HttpModule', async () => {
      const customHttpModule = HttpModule.register({
        timeout: 5_000,
        baseURL: 'https://custom.api.url',
      });
      
      const config: OpenCnpjConfig = {
        httpModule: customHttpModule,
      };
      
      module = await Test.createTestingModule({
        imports: [OpenCnpjModule.register(config)],
      }).compile();

      expect(module).toBeDefined();
      expect(module.get(OpenCnpjModule)).toBeDefined();
    });
  });

  describe('registerAsync', () => {
    it('should create module with HttpModule.registerAsync', () => {
      const asyncOptions: OpenCnpjAsyncOptions = {
        httpModuleAsync: {
          useFactory: async () => ({
            timeout: 7_000,
            maxRedirects: 3,
            baseURL: 'https://api.opencnpj.org',
          }),
        },
      };

      const dynamicModule = OpenCnpjModule.registerAsync(asyncOptions);

      expect(dynamicModule.module).toBe(OpenCnpjModule);
      expect(dynamicModule.imports).toHaveLength(1);
      expect(dynamicModule.providers).toEqual([OpenCnpjService]);
      expect(dynamicModule.exports).toEqual([OpenCnpjService]);
    });

    it('should fallback to default HttpModule when no async options provided', () => {
      // @ts-expect-error intentionally passing empty options to test fallback
      const dynamicModule = OpenCnpjModule.registerAsync({});

      expect(dynamicModule.module).toBe(OpenCnpjModule);
      expect(dynamicModule.imports).toHaveLength(1);
      expect(dynamicModule.providers).toEqual([OpenCnpjService]);
      expect(dynamicModule.exports).toEqual([OpenCnpjService]);
    });
  });
});
