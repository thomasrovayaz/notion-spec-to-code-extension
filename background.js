const nestJSGenerator = [
    {
        id: "structure",
        title: "Generate Structure",
        prompt: "You should create all the folders.",
    },
    {
        id: "controller",
        title: "Generate Controller",
        prompt: "You should only generate the code of the controller files. The controller files contains 'controller.ts' in the name. You should not generate any other file.",
        example: "import {\n" +
            "  Controller,\n" +
            "  Get,\n" +
            "  Req,\n" +
            "  UseGuards,\n" +
            "  UseInterceptors,\n" +
            "} from '@nestjs/common'\n" +
            "import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'\n" +
            "import { plainToInstance } from 'class-transformer'\n" +
            "\n" +
            "import { AuthenticatedWorker, WorkerAuthGuard } from '@hublo/auth'\n" +
            "import { ApiRoute } from '@hublo/decorators'\n" +
            "\n" +
            "import { ExampleInterceptor } from '../../domain/interceptors/example-error.interceptor'\n" +
            "import { GetExampleService } from '../../services/example/get-example.service'\n" +
            "\n" +
            "import { GetExampleResponseDto } from './dtos/get-example-response.dto'\n" +
            "\n" +
            "@ApiTags('Example')\n" +
            "@Controller('example')\n" +
            "@ApiBearerAuth()\n" +
            "export class GetExampleController {\n" +
            "  constructor(\n" +
            "    private readonly getExampleService: GetExampleService,\n" +
            "  ) {}\n" +
            "\n" +
            "  @ApiRoute({\n" +
            "    summary: 'Get example',\n" +
            "    ok: {\n" +
            "      type: GetExampleResponseDto,\n" +
            "    },\n" +
            "    forbidden: {},\n" +
            "    notFound: {},\n" +
            "    serviceUnavailable: {},\n" +
            "    unauthorized: {},\n" +
            "  })\n" +
            "  @Get()\n" +
            "  @UseGuards(WorkerAuthGuard)\n" +
            "  @UseInterceptors(ExampleInterceptor)\n" +
            "  async getExample(@Req() { user }: { user: AuthenticatedWorker }) {\n" +
            "    const example = await this.getExampleService.getExample(user)\n" +
            "    return plainToInstance(GetExampleResponseDto, example)\n" +
            "  }\n" +
            "}\n"
    }, {
        id: "controller-unit-test",
        title: "Generate Controller Unit Test",
        prompt: "You should only generate the code of the unit test file of the controllers. The unit test files of a controller contains 'controller.spec.ts' in the name. You should not generate any other file.",
        example: "import type { NestFastifyApplication } from '@nestjs/platform-fastify'\n" +
            "import { mockDeep } from 'jest-mock-extended'\n" +
            "\n" +
            "import { path as apiTypesPath } from '@hublo/api-types/bff-worker/GetExampleController/getExample'\n" +
            "import type { AuthenticatedWorker } from '@hublo/auth'\n" +
            "import {\n" +
            "  DatabaseQueryFailedException,\n" +
            "  RemoteBackendException,\n" +
            "  ResourceAccessException,\n" +
            "} from '@hublo/exceptions'\n" +
            "\n" +
            "import { BffWorkerTestWrapper } from '../../../../app/test/bff-worker.test-wrapper'\n" +
            "import { NoExampleFoundError } from '../../domain/errors/no-example-found.error'\n" +
            "import { GetExampleService } from '../../services/get-example/get-example.service'\n" +
            "\n" +
            "import { GetExampleResponseDto } from './dtos/get-example-response.dto'\n" +
            "import { GetExampleController } from './get-example.controller'\n" +
            "\n" +
            "describe('GetExampleController', () => {\n" +
            "  const path = apiTypesPath.replace('/bff-worker', '')\n" +
            "  let getExampleController: GetExampleController\n" +
            "  let app: NestFastifyApplication\n" +
            "  const mockedGetExampleService =\n" +
            "    mockDeep<GetExampleService>()\n" +
            "  const user = { id: 1, userType: 'worker' } as AuthenticatedWorker\n" +
            "  const mockedExample = { }\n" +
            "\n" +
            "  beforeEach(async () => {\n" +
            "    app = await BffWorkerTestWrapper.createTestingApp({\n" +
            "      controllers: [GetExampleController],\n" +
            "      providers: [\n" +
            "        {\n" +
            "          provide: GetExampleService,\n" +
            "          useValue: mockedGetExampleService,\n" +
            "        },\n" +
            "      ],\n" +
            "      imports: [],\n" +
            "    })\n" +
            "\n" +
            "    getExampleController = app.get(GetExampleController)\n" +
            "\n" +
            "    mockedGetExampleService.getExample.mockResolvedValue(mockedExample)\n" +
            "  })\n" +
            "\n" +
            "  describe('getExample', () => {\n" +
            "    it('should return an instance of GetExampleResponseDto', async () => {\n" +
            "      const result = await getExampleController.getExample({\n" +
            "        user,\n" +
            "      })\n" +
            "\n" +
            "      expect(result).toBeInstanceOf(GetExampleResponseDto)\n" +
            "    })\n" +
            "\n" +
            "    describe('when GET request is valid', () => {\n" +
            "      it('should return a 200 response', async () => {\n" +
            "        const result = await app.inject({\n" +
            "          method: 'GET',\n" +
            "          url: path,\n" +
            "          headers: {\n" +
            "            user: JSON.stringify(user),\n" +
            "          },\n" +
            "        })\n" +
            "\n" +
            "        expect(result.statusCode).toBe(200)\n" +
            "      })\n" +
            "\n" +
            "      it('should return a plain object GetExampleResponseDto', async () => {\n" +
            "        const result = await app.inject({\n" +
            "          method: 'GET',\n" +
            "          url: path,\n" +
            "          headers: {\n" +
            "            user: JSON.stringify(user),\n" +
            "          },\n" +
            "        })\n" +
            "\n" +
            "        expect(result.json()).toStrictEqual({ })\n" +
            "      })\n" +
            "    })\n" +
            "\n" +
            "    describe('when worker token is not valid', () => {\n" +
            "      it('should return a 403 forbidden error', async () => {\n" +
            "        const result = await app.inject({\n" +
            "          method: 'GET',\n" +
            "          url: path,\n" +
            "        })\n" +
            "\n" +
            "        expect(result.statusCode).toBe(403)\n" +
            "      })\n" +
            "    })\n" +
            "\n" +
            "    describe('when GET request fails', () => {\n" +
            "      it('should return a 403 forbidden error', async () => {\n" +
            "        mockedGetExampleService.getExample.mockRejectedValue(\n" +
            "          new ResourceAccessException('Forbidden Access'),\n" +
            "        )\n" +
            "\n" +
            "        const result = await app.inject({\n" +
            "          method: 'GET',\n" +
            "          url: path,\n" +
            "          headers: {\n" +
            "            user: JSON.stringify(user),\n" +
            "          },\n" +
            "        })\n" +
            "\n" +
            "        expect(result.statusCode).toBe(403)\n" +
            "      })\n" +
            "\n" +
            "      it('should return a 404 not found error', async () => {\n" +
            "        mockedGetExampleService.getExample.mockRejectedValue(\n" +
            "          new NoExampleFoundError(user.hubloId as string),\n" +
            "        )\n" +
            "\n" +
            "        const result = await app.inject({\n" +
            "          method: 'GET',\n" +
            "          url: path,\n" +
            "          headers: {\n" +
            "            user: JSON.stringify(user),\n" +
            "          },\n" +
            "        })\n" +
            "\n" +
            "        expect(result.statusCode).toBe(404)\n" +
            "      })\n" +
            "\n" +
            "      it('should return a 502 bad gateway error when query fails', async () => {\n" +
            "        mockedGetExampleService.getExample.mockRejectedValue(\n" +
            "          new DatabaseQueryFailedException(''),\n" +
            "        )\n" +
            "\n" +
            "        const result = await app.inject({\n" +
            "          method: 'GET',\n" +
            "          url: path,\n" +
            "          headers: {\n" +
            "            user: JSON.stringify(user),\n" +
            "          },\n" +
            "        })\n" +
            "\n" +
            "        expect(result.statusCode).toBe(502)\n" +
            "      })\n" +
            "\n" +
            "      it('should return a 503 service unavailable error when remote fails', async () => {\n" +
            "        mockedGetExampleService.getExample.mockRejectedValue(\n" +
            "          new RemoteBackendException('', '', new Error()),\n" +
            "        )\n" +
            "\n" +
            "        const result = await app.inject({\n" +
            "          method: 'GET',\n" +
            "          url: path,\n" +
            "          headers: {\n" +
            "            user: JSON.stringify(user),\n" +
            "          },\n" +
            "        })\n" +
            "\n" +
            "        expect(result.statusCode).toBe(503)\n" +
            "      })\n" +
            "    })\n" +
            "  })\n" +
            "})\n"
    }, {
        id: "service",
        title: "Generate Service",
        prompt: "You should only generate the code of the service files. The service files contains 'service.ts' in the name. You should not generate any other file.",
        example: "import { Injectable } from '@nestjs/common'\n" +
            "\n" +
            "import { ExampleProvider } from '../../domain/provider-contracts/example.provider'\n" +
            "\n" +
            "@Injectable()\n" +
            "export class ExampleService {\n" +
            "  constructor(\n" +
            "    @Inject(ExampleProvider)\n" +
            "    private readonly exampleProvider: ExampleProvider,\n" +
            "  ) {}\n" +
            "\n" +
            "  async getExample(\n" +
            "    authenticatedWorker: AuthenticatedWorker,\n" +
            "  ): Promise<number | undefined> {\n" +
            "    const example = await this.exampleProvider.getExample(\n" +
            "      authenticatedWorker.hubloId,\n" +
            "    )\n" +
            "\n" +
            "    return example\n" +
            "  }\n" +
            "}\n"
    },  {
        id: "service-unit-test",
        title: "Generate Service Unit Test",
        prompt: "You should only generate the code of the unit test files of the services. The unit test files of a service contains 'service.spec.ts' in the name. You should not generate any other file.",
        example: "import { mockDeep } from 'jest-mock-extended'\n" +
            "\n" +
            "import { authenticatedWorker } from '@hublo/auth'\n" +
            "\n" +
            "import { NoExampleFoundError } from '../../domain/errors/no-example-found.error'\n" +
            "import { mockedExample } from '../../domain/mocks/mocks.mock'\n" +
            "import type { ExampleProvider } from '../../domain/provider-contracts/example.provider'\n" +
            "\n" +
            "import { GetExampleService } from './get-example.service'\n" +
            "\n" +
            "describe('GetExampleService', () => {\n" +
            "  let getExampleService: GetExampleService\n" +
            "  const mockedExampleProvider = mockDeep<ExampleProvider>()\n" +
            "\n" +
            "  beforeEach(() => {\n" +
            "    getExampleService = new GetExampleService(\n" +
            "      mockedExampleProvider,\n" +
            "    )\n" +
            "  })\n" +
            "\n" +
            "  describe('getExample', () => {\n" +
            "    it('should get example correctly', async () => {\n" +
            "      // given\n" +
            "      mockedExampleProvider.getExample.mockResolvedValue(\n" +
            "        mockedExample,\n" +
            "      )\n" +
            "\n" +
            "      // when\n" +
            "      const example = await getExampleService.getExample(\n" +
            "        authenticatedWorker,\n" +
            "      )\n" +
            "\n" +
            "      // then\n" +
            "      expect(\n" +
            "        mockedExampleProvider.getExample,\n" +
            "      ).toHaveBeenCalledWith(authenticatedWorker.hubloId)\n" +
            "      expect(example).toBe({ })\n" +
            "    })\n" +
            "\n" +
            "    it('should throw not found error if no example is available', async () => {\n" +
            "      // given\n" +
            "      mockedExampleProvider.getExample.mockRejectedValue(\n" +
            "        new NoExampleFoundError(authenticatedWorker.hubloId),\n" +
            "      )\n" +
            "\n" +
            "      // when & then\n" +
            "      await expect(\n" +
            "        getExampleService.getExample(authenticatedWorker),\n" +
            "      ).rejects.toThrow(NoExampleFoundError)\n" +
            "    })\n" +
            "  })\n" +
            "})\n"
    },  {
        id: "module",
        title: "Generate Module",
        prompt: "You should only generate the code of the module file. The module file contains 'module.ts' in the name. You should not generate any other file.",
        example: "import { Module } from '@nestjs/common'\n" +
            "\n" +
            "import { GetExampleController } from './controllers/get-example/get-example.controller'\n" +
            "import { ExampleProvider } from './domain/provider-contracts/example.contract'\n" +
            "import { ExampleProviderHttpImpl } from './providers/example/example.https.provider'\n" +
            "import { GetExampleService } from './services/get-example/get-example.service'\n" +
            "\n" +
            "@Module({\n" +
            "  providers: [\n" +
            "    {\n" +
            "      provide: ExampleProvider,\n" +
            "      useClass: ExampleProviderHttpImpl,\n" +
            "    },\n" +
            "    GetExampleService,\n" +
            "  ],\n" +
            "  controllers: [GetExampleController],\n" +
            "})\n" +
            "export class HubloPoolOfferModule {}\n"
    },  {
        id: "provider",
        title: "Generate Provider",
        prompt: "You should only generate the code of the provider files. A provider file contains 'provider.ts' in the name. You should not generate any other file.",
        example: "import { HttpService } from '@nestjs/axios'\n" +
            "import {\n" +
            "  BadRequestException,\n" +
            "  ConflictException,\n" +
            "  Inject,\n" +
            "  Injectable,\n" +
            "  NotFoundException,\n" +
            "} from '@nestjs/common'\n" +
            "import type { AxiosError } from 'axios'\n" +
            "import { catchError, lastValueFrom, map } from 'rxjs'\n" +
            "\n" +
            "import {\n" +
            "  GetExampleSuccess,\n" +
            "  GetExampleFailure,\n" +
            "  getPath,\n" +
            "} from '@hublo/api-types/service-example/GetExampleController/getExample'\n" +
            "import { AppConfig } from '@hublo/configuration'\n" +
            "import {\n" +
            "  ResourceAccessException,\n" +
            "  DatabaseQueryFailedException,\n" +
            "  RemoteBackendException,\n" +
            "  RemoteDependencyException,\n" +
            "} from '@hublo/exceptions'\n" +
            "\n" +
            "import type { BFFWorkerAppConfig } from '../../../../app/config/bff-worker-app.config'\n" +
            "import type { HubloPoolOfferProvider } from '../../domain/provider-contracts/hublo-pool-offer.contract'\n" +
            "\n" +
            "@Injectable()\n" +
            "export class ExampleProviderHttpImpl implements ExampleProvider {\n" +
            "  constructor(\n" +
            "    @Inject(AppConfig)\n" +
            "    private readonly config: BFFWorkerAppConfig,\n" +
            "    private readonly httpService: HttpService,\n" +
            "  ) {}\n" +
            "\n" +
            "  async getExample(\n" +
            "    hubloId: string,\n" +
            "  ): Promise<GetExampleSuccess> {\n" +
            "    const url = `${this.config.monorepoBaseUrl}${getPath(hubloId)}`\n" +
            "\n" +
            "    const response = await lastValueFrom(\n" +
            "      this.httpService\n" +
            "        .get<GetExampleSuccess>(url, {\n" +
            "          headers: {\n" +
            "            Authorization: `Bearer `,\n" +
            "          },\n" +
            "        })\n" +
            "        .pipe(map((result) => result.data))\n" +
            "        .pipe(\n" +
            "          catchError((err: AxiosError<{ message?: string }>) => {\n" +
            "            const status = err.response?.status\n" +
            "            if (status === 502) {\n" +
            "              throw new DatabaseQueryFailedException(err.message)\n" +
            "            }\n" +
            "            if (status === 404) {\n" +
            "              throw new NotFoundException(err.message)\n" +
            "            }\n" +
            "            throw new RemoteBackendException(url, err.message, err)\n" +
            "          }),\n" +
            "        ),\n" +
            "    )\n" +
            "\n" +
            "    return response\n" +
            "  }\n" +
            "}\n"
    },  {
        id: "provider-unit-test",
        title: "Generate Provider Unit Test",
        prompt: "You should only generate the code of the unit test files of the providers. The unit test files of the provider contains 'provider.spec.ts' in the name. You should not generate any other file.",
        example: "import {\n" +
            "  BadRequestException,\n" +
            "  ConflictException,\n" +
            "  NotFoundException,\n" +
            "} from '@nestjs/common'\n" +
            "import { REQUEST } from '@nestjs/core'\n" +
            "import type { TestingModule } from '@nestjs/testing'\n" +
            "import { rest } from 'msw'\n" +
            "\n" +
            "import { getPath } from '@hublo/api-types/service-example/GetExampleController/getExample'\n" +
            "import { authenticatedWorker } from '@hublo/auth'\n" +
            "import { AppConfig } from '@hublo/configuration'\n" +
            "import {\n" +
            "  DatabaseQueryFailedException,\n" +
            "  RemoteDependencyException,\n" +
            "  ResourceAccessException,\n" +
            "} from '@hublo/exceptions'\n" +
            "import { HttpServiceModule } from '@hublo/http/http.module'\n" +
            "import { AppLoggerModule } from '@hublo/logs'\n" +
            "import { server } from '@hublo/test/msw/server'\n" +
            "\n" +
            "import type { BFFWorkerAppConfig } from '../../../../app/config/bff-worker-app.config'\n" +
            "import { BffWorkerTestWrapper } from '../../../../app/test/bff-worker.test-wrapper'\n" +
            "import { mockedExample } from '../../domain/mocks/mocks.mock'\n" +
            "\n" +
            "import { ExampleProviderHttpImpl } from './example.provider'\n" +
            "\n" +
            "describe('Example provider', () => {\n" +
            "  let exampleProvider: ExampleProviderHttpImpl\n" +
            "  let module: TestingModule\n" +
            "  let config: BFFWorkerAppConfig\n" +
            "\n" +
            "  beforeAll(async () => {\n" +
            "    module = await BffWorkerTestWrapper.createTestingModule({\n" +
            "      imports: [HttpServiceModule, AppLoggerModule],\n" +
            "      providers: [ExampleProviderHttpImpl],\n" +
            "    })\n" +
            "      .overrideProvider(REQUEST)\n" +
            "      .useValue({ authInfo: { token: 'token' } })\n" +
            "      .compile()\n" +
            "\n" +
            "    exampleProvider = await module.resolve(ExampleProviderHttpImpl)\n" +
            "    config = module.get<BFFWorkerAppConfig>(AppConfig)\n" +
            "  })\n" +
            "\n" +
            "  it('should be defined', () => {\n" +
            "    // then\n" +
            "    expect(exampleProvider).toBeDefined()\n" +
            "  })\n" +
            "\n" +
            "  describe('Get example', () => {\n" +
            "    it('should returns example when successful', async () => {\n" +
            "      const idHubler = authenticatedWorker.hubloId\n" +
            "      // given\n" +
            "      server.use(\n" +
            "        rest.get(\n" +
            "          `${config.monorepoBaseUrl}${getPath(idHubler)}`,\n" +
            "          (_, res, ctx) => res(ctx.status(204), ctx.json(mockedExample)),\n" +
            "        ),\n" +
            "      )\n" +
            "\n" +
            "      // when & then\n" +
            "      const result = await exampleProvider.getExample(idHubler)\n" +
            "      expect(result.result).toBe(mockedExample)\n" +
            "    })\n" +
            "\n" +
            "    it('should throw DatabaseQueryFailedException', async () => {\n" +
            "      // given\n" +
            "      const idHubler = authenticatedWorker.hubloId\n" +
            "      server.use(\n" +
            "        rest.get(\n" +
            "          `${config.monorepoBaseUrl}${getPath(idHubler)}`,\n" +
            "          (_, res, ctx) => res(ctx.status(502), ctx.json({})),\n" +
            "        ),\n" +
            "      )\n" +
            "\n" +
            "    it('should throw NotFoundException', async () => {\n" +
            "      // given\n" +
            "      const idHubler = authenticatedWorker.hubloId\n" +
            "      // given\n" +
            "      server.use(\n" +
            "        rest.get(\n" +
            "          `${config.monorepoBaseUrl}${getPath(idHubler)}`,\n" +
            "          (_, res, ctx) => res(ctx.status(404), ctx.json({})),\n" +
            "        ),\n" +
            "      )\n" +
            "\n" +
            "      // when\n" +
            "      const output = exampleProvider.getExample(idHubler)\n" +
            "\n" +
            "      // then\n" +
            "      await expect(output).rejects.toThrow(NotFoundException)\n" +
            "    })\n" +
            "  })\n" +
            "})\n"
    }]

chrome.runtime.onMessage.addListener(async (msg) => {
    if (msg.command === 'callChatGPT') {
        await chrome.storage.local.get(['customPrompt', 'apiKey'], async ({ customPrompt, apiKey }) => {
            await chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                chrome.storage.local.set({ 'loading': true });
                try {
                    console.log(tabs[0])
                    const pageId = urlToPageId(tabs[0].url);

                    chrome.storage.local.set({
                            currentPrompt: msg.currentPrompt
                        }
                    );

                    if (msg.currentPrompt ) {
                        const generatedCommands = await chrome.scripting.executeScript({
                            target: { tabId: tabs[0].id },
                            args: [
                                pageId,
                                apiKey,
                                customPrompt || '',
                                msg.technology || 'NestJS',
                                msg.currentPrompt
                            ],
                            func: callChatGPTWithSpec
                        });
                        console.log(generatedCommands[0].result)
                        chrome.storage.local.set({
                            'commands': generatedCommands[0].result,
                            'lastPageGenerated': pageId
                        });
                    } else {
                        const results = await Promise.all(
                            nestJSGenerator.map(async (nestJSGeneratorElement) => {
                                const generatedCommands = await chrome.scripting.executeScript({
                                    target: {tabId: tabs[0].id},
                                    args: [
                                        pageId,
                                        apiKey,
                                        customPrompt || '',
                                        msg.technology || 'NestJS',
                                        nestJSGeneratorElement.example ?
                                            `${nestJSGeneratorElement.prompt}. To accomplish your instructions, you should understand and use the style of code from this example of code: "${nestJSGeneratorElement.example}".`
                                            : nestJSGeneratorElement.prompt
                                    ],
                                    func: callChatGPTWithSpec
                                });
                                console.log(`${nestJSGeneratorElement.id} loaded`)
                                console.log(generatedCommands[0].result)
                                return {
                                    id: nestJSGeneratorElement.id,
                                    title: nestJSGeneratorElement.title,
                                    result: generatedCommands[0].result
                                }
                            })
                        );

                        console.log("results")
                        console.log(results)
                        chrome.storage.local.set({
                            'commands': results
                                .sort(
                                    (a, b) =>
                                        a.id === 'structure' ? -1 : b.id === 'structure' ? 1 : 0
                                )
                                .map(({result}) => result)
                                .join('\n'),
                            'lastPageGenerated': pageId
                        });
                    }
                } catch (error) {
                    console.error('Error generating commands from AI:', error);
                }
                chrome.storage.local.set({ 'loading': false });
                chrome.notifications.create('commandsGenerated', {
                    type: 'basic',
                    iconUrl: 'icon48.png',
                    title: 'Commands Generated!',
                    message: "The shell commands have been generated. Click the button below to copy them to your clipboard.",
                    priority: 0
                });
            });
        });
    }
});

function urlToPageId(url) {
    if (!url) {
        return '';
    }
    const paths = url.split('/');
    const pageSlug = paths[paths.length - 1];
    const pageSlugSplit = pageSlug.split('-');
    return pageSlugSplit[pageSlugSplit.length - 1];
}

function onNotificationClicked() {
    chrome.windows.create({
        focused: true,
        type: 'popup',
        url: 'popup.html',
        width: 530,
        height: 511,
    });
}

chrome.notifications.onClicked.addListener(onNotificationClicked)

chrome.runtime.onInstalled.addListener(({ reason, version }) => {
    console.log('onInstalled', reason, version);
    chrome.storage.local.remove(['commands', 'lastPageGenerated', 'loading']);
});


async function callChatGPTWithSpec(pageId, apiKey, customPrompt, technology, customPromptTmp) {
    async function callChatGPT(messages) {
        if (!apiKey) {
            window.alert('Please set your API key in the options page.');
            return;
        }
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    "model": "gpt-3.5-turbo",
                    "messages": messages,
                    n: 1,
                    stop: null,
                    temperature: 0.2,
                })
            }).then(response => response.json());

            let choice = response.choices[0]
            generatedCommands = choice.message.content.trim()
                .replaceAll('!', '\\!')
                .replaceAll('$', '\\$');

            //console.log('Generated commands:\n');
            //console.log(generatedCommands);

            return generatedCommands;
        } catch (error) {
            console.error('Error generating commands from AI:', error);
        }
    }

    const pageContent = document.getElementsByTagName('main')[0].innerText;
    try {
        let generatedCommands;
        let prompt = `I ll give you the specifications of a NestJS module.`
            + ` You will understand them and then I ll give some very precise instruction based on those specifications.`
            + ` Do not do anything that is not in the instructions.`
            + ` The specification are: "\n${pageContent}\n". This is the end of the specification.`;

        console.log(prompt);
        const messages = [
            {"role": "user", "content": `Ignore all instructions before this one. You’re a senior developer. You have been making development for 20 years. Your task is now to generate ${technology} code.`},
            {"role": "user", "content": prompt},
            {"role": "user", "content": `The instructions are: "${customPromptTmp}".`
                    + `Generate shell commands to make the previous instructions.`
                    + `Do not write any other text than the shell commands.`
                    + `You should reply ONLY the shell commands so I can copy and paste your response directly in the terminal.`
                    + `You can use mkdir and echo command to accomplish the instructions.`},
        ]
        generatedCommands = await callChatGPT(messages);

        //console.log('Generated commands:\n');
        //console.log(generatedCommands);

        //chrome.storage.local.set({ 'commands': generatedCommands, 'lastPageGenerated': pageId });
        return generatedCommands;
    } catch (error) {
        console.error('Error generating commands from AI:', error);
    }
}
