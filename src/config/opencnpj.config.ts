import { HttpModule, HttpModuleAsyncOptions } from "@nestjs/axios";

export interface OpenCnpjConfig {
  httpModule?: HttpModule;
}

export interface OpenCnpjAsyncOptions {
  httpModuleAsync: HttpModuleAsyncOptions;
}