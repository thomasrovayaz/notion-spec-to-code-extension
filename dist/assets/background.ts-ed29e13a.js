import{g as d}from"./get-from-local-storage-e32e525a.js";import{g as u}from"./page-infos-e73a98a1.js";async function h(e){const{apiKey:a,model:r}=await d(["apiKey","model"]);if(!a){window.alert("Please set your API key in the options page.");return}console.log("completions for",e);try{let n=(await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${a}`},body:JSON.stringify({model:r||"gpt-4",messages:e,n:1,stop:null,temperature:0})}).then(i=>i.json())).choices[0];return console.debug(n),n.message.content.trim().replaceAll("!","\\!").replaceAll("```","")}catch(t){console.error("Error generating commands from AI:",t)}}async function l(e,a,r){try{let t,n=`I ll give you the specifications. You will understand them and then I ll give some very precise instruction based on those specifications. Do not do anything that is not in the instructions. The specification are: "
${r}
". This is the end of the specification.`;const i=[{role:"user",content:`Ignore all instructions before this one. You’re a senior developer. You have been making development for 20 years. Your task is now to generate ${e} code.`},{role:"user",content:n},{role:"user",content:`The instructions are: "${a}".Generate shell commands to make the previous instructions.Do not write any other text than the shell commands. Do not write any comment. Do not write the language used. You should reply ONLY the shell commands so I can copy and paste your response directly in the terminal. The response should be a list of shell commands.You can use mkdir and echo command to accomplish the instructions.`}];return t=await h(i),console.log("generatedCommands",t),t}catch(t){console.error("Error generating commands from AI:",t)}}const x=[{id:"structure",title:"Generate Structure",prompt:"You should create all the folders."},{id:"controller",title:"Generate Controller",regex:/controller.ts$/,promptOneFile:"You should generate the code of the controller file FILENAME. You should adapt the guard, if the controller is in bff-worker folder you should use WorkerAuthGuard, if the controller is in bff-admin folder you should use AdminAuthGuard, otherwise you should use the SuperAdminAuthGuard. You should not add @Req param to get the user when you use the SuperAdminAuthGuard. You should adapt the params with body and query if necessary.  ",prompt:"You should only generate the code of the controller files. The controller files contains 'controller.ts' in the name. You should not generate any other file.",example:`import {
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { plainToInstance } from 'class-transformer'

import { AuthenticatedWorker, WorkerAuthGuard } from '@hublo/auth'
import { ApiRoute } from '@hublo/decorators'

import { ExampleInterceptor } from '../../domain/interceptors/example-error.interceptor'
import { GetExampleService } from '../../services/example/get-example.service'

import { GetExampleResponseDto } from './dtos/get-example-response.dto'

@ApiTags('Example')
@Controller('example')
@ApiBearerAuth()
export class GetExampleController {
  constructor(
    private readonly getExampleService: GetExampleService,
  ) {}

  @ApiRoute({
    summary: 'Get example',
    ok: {
      type: GetExampleResponseDto,
    },
    forbidden: {},
    notFound: {},
    serviceUnavailable: {},
    unauthorized: {},
  })
  @Get()
  @UseGuards(WorkerAuthGuard)
  @UseInterceptors(ExampleInterceptor)
  async getExample(@Req() { user }: { user: AuthenticatedWorker }) {
    const example = await this.getExampleService.getExample(user)
    return plainToInstance(GetExampleResponseDto, example)
  }
}`},{id:"controller-unit-test",title:"Generate Controller Unit Test",regex:/controller.spec.ts$/,promptOneFile:"You should generate the code of the controller unit test file FILENAME. ",prompt:"You should only generate the code of the unit test file of the controllers. The unit test files of a controller contains 'controller.spec.ts' in the name. You should not generate any other file.",example:`import type { NestFastifyApplication } from '@nestjs/platform-fastify'
import { mockDeep } from 'jest-mock-extended'

import { path as apiTypesPath } from '@hublo/api-types/bff-worker/GetExampleController/getExample'
import type { AuthenticatedWorker } from '@hublo/auth'
import {
  DatabaseQueryFailedException,
  RemoteBackendException,
  ResourceAccessException,
} from '@hublo/exceptions'

import { BffWorkerTestWrapper } from '../../../../app/test/bff-worker.test-wrapper'
import { NoExampleFoundError } from '../../domain/errors/no-example-found.error'
import { GetExampleService } from '../../services/get-example/get-example.service'

import { GetExampleResponseDto } from './dtos/get-example-response.dto'
import { GetExampleController } from './get-example.controller'

describe('GetExampleController', () => {
  const path = apiTypesPath.replace('/bff-worker', '')
  let getExampleController: GetExampleController
  let app: NestFastifyApplication
  const mockedGetExampleService =
    mockDeep<GetExampleService>()
  const user = { id: 1, userType: 'worker' } as AuthenticatedWorker
  const mockedExample = { }

  beforeEach(async () => {
    app = await BffWorkerTestWrapper.createTestingApp({
      controllers: [GetExampleController],
      providers: [
        {
          provide: GetExampleService,
          useValue: mockedGetExampleService,
        },
      ],
      imports: [],
    })

    getExampleController = app.get(GetExampleController)

    mockedGetExampleService.getExample.mockResolvedValue(mockedExample)
  })

  describe('getExample', () => {
    it('should return an instance of GetExampleResponseDto', async () => {
      const result = await getExampleController.getExample({
        user,
      })

      expect(result).toBeInstanceOf(GetExampleResponseDto)
    })

    describe('when GET request is valid', () => {
      it('should return a 200 response', async () => {
        const result = await app.inject({
          method: 'GET',
          url: path,
          headers: {
            user: JSON.stringify(user),
          },
        })

        expect(result.statusCode).toBe(200)
      })

      it('should return a plain object GetExampleResponseDto', async () => {
        const result = await app.inject({
          method: 'GET',
          url: path,
          headers: {
            user: JSON.stringify(user),
          },
        })

        expect(result.json()).toStrictEqual({ })
      })
    })

    describe('when worker token is not valid', () => {
      it('should return a 403 forbidden error', async () => {
        const result = await app.inject({
          method: 'GET',
          url: path,
        })

        expect(result.statusCode).toBe(403)
      })
    })

    describe('when GET request fails', () => {
      it('should return a 403 forbidden error', async () => {
        mockedGetExampleService.getExample.mockRejectedValue(
          new ResourceAccessException('Forbidden Access'),
        )

        const result = await app.inject({
          method: 'GET',
          url: path,
          headers: {
            user: JSON.stringify(user),
          },
        })

        expect(result.statusCode).toBe(403)
      })

      it('should return a 404 not found error', async () => {
        mockedGetExampleService.getExample.mockRejectedValue(
          new NoExampleFoundError(user.hubloId as string),
        )

        const result = await app.inject({
          method: 'GET',
          url: path,
          headers: {
            user: JSON.stringify(user),
          },
        })

        expect(result.statusCode).toBe(404)
      })

      it('should return a 502 bad gateway error when query fails', async () => {
        mockedGetExampleService.getExample.mockRejectedValue(
          new DatabaseQueryFailedException(''),
        )

        const result = await app.inject({
          method: 'GET',
          url: path,
          headers: {
            user: JSON.stringify(user),
          },
        })

        expect(result.statusCode).toBe(502)
      })

      it('should return a 503 service unavailable error when remote fails', async () => {
        mockedGetExampleService.getExample.mockRejectedValue(
          new RemoteBackendException('', '', new Error()),
        )

        const result = await app.inject({
          method: 'GET',
          url: path,
          headers: {
            user: JSON.stringify(user),
          },
        })

        expect(result.statusCode).toBe(503)
      })
    })
  })
})`},{id:"service",title:"Generate Service",regex:/service\.ts$/,promptOneFile:"You should generate the code of the service file FILENAME. ",prompt:"You should only generate the code of the service files. The service files contains 'service.ts' in the name. You should not generate any other file.",example:`import { Injectable } from '@nestjs/common'

import { ExampleProvider } from '../../domain/provider-contracts/example.provider'

@Injectable()
export class ExampleService {
  constructor(
    @Inject(ExampleProvider)
    private readonly exampleProvider: ExampleProvider,
  ) {}

  async getExample(
    authenticatedWorker: AuthenticatedWorker,
  ): Promise<number | undefined> {
    const example = await this.exampleProvider.getExample(
      authenticatedWorker.hubloId,
    )

    return example
  }
}`},{id:"service-unit-test",regex:/service\.spec\.ts$/,title:"Generate Service Unit Test",promptOneFile:"You should generate the code of the service unit test file FILENAME. ",prompt:"You should only generate the code of the unit test files of the services. The unit test files of a service contains 'service.spec.ts' in the name. You should not generate any other file.",example:`import { mockDeep } from 'jest-mock-extended'

import { authenticatedWorker } from '@hublo/auth'

import { NoExampleFoundError } from '../../domain/errors/no-example-found.error'
import { mockedExample } from '../../domain/mocks/mocks.mock'
import type { ExampleProvider } from '../../domain/provider-contracts/example.provider'

import { GetExampleService } from './get-example.service'

describe('GetExampleService', () => {
  let getExampleService: GetExampleService
  const mockedExampleProvider = mockDeep<ExampleProvider>()

  beforeEach(() => {
    getExampleService = new GetExampleService(
      mockedExampleProvider,
    )
  })

  describe('getExample', () => {
    it('should get example correctly', async () => {
      // given
      mockedExampleProvider.getExample.mockResolvedValue(
        mockedExample,
      )

      // when
      const example = await getExampleService.getExample(
        authenticatedWorker,
      )

      // then
      expect(
        mockedExampleProvider.getExample,
      ).toHaveBeenCalledWith(authenticatedWorker.hubloId)
      expect(example).toBe({ })
    })

    it('should throw not found error if no example is available', async () => {
      // given
      mockedExampleProvider.getExample.mockRejectedValue(
        new NoExampleFoundError(authenticatedWorker.hubloId),
      )

      // when & then
      await expect(
        getExampleService.getExample(authenticatedWorker),
      ).rejects.toThrow(NoExampleFoundError)
    })
  })
})`},{id:"module",title:"Generate Module",regex:/module\.ts$/,promptOneFile:"You should only generate the code of the module file FILENAME. ",prompt:"You should only generate the code of the module file. The module file contains 'module.ts' in the name. You should not generate any other file.",example:`import { Module } from '@nestjs/common'

import { GetExampleController } from './controllers/get-example/get-example.controller'
import { ExampleProvider } from './domain/provider-contracts/example.contract'
import { ExampleProviderHttpImpl } from './providers/example/example.https.provider'
import { GetExampleService } from './services/get-example/get-example.service'

@Module({
  providers: [
    {
      provide: ExampleProvider,
      useClass: ExampleProviderHttpImpl,
    },
    GetExampleService,
  ],
  controllers: [GetExampleController],
})
export class HubloPoolOfferModule {}`},{id:"contract_provider",title:"Generate Contract Provider",regex:/contracts\/.*\.contract\.ts$/,promptOneFile:"You should generate the code of the contract provider file FILENAME. It is an interface that defines the methods of the provider. ",prompt:"You should only generate the code of the provider files. A provider file contains 'provider.ts' in the name. You should not generate any other file.",example:`import type { Example } from '../types/example.type'

export interface ExampleProvider {
  getExample(id: string): Promise<Example>
}

export const ExampleProvider = Symbol('ExampleProvider')`},{id:"http_provider",title:"Generate HTTP Provider",regex:/https\.provider\.ts$/,promptOneFile:"You should generate the code of the http provider file FILENAME. ",prompt:"You should only generate the code of the provider files. A provider file contains 'provider.ts' in the name. You should not generate any other file.",example:`import { HttpService } from '@nestjs/axios'
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import type { AxiosError } from 'axios'
import { catchError, lastValueFrom, map } from 'rxjs'

import {
  GetExampleSuccess,
  GetExampleFailure,
  getPath,
} from '@hublo/api-types/service-example/GetExampleController/getExample'
import { AppConfig } from '@hublo/configuration'
import {
  ResourceAccessException,
  DatabaseQueryFailedException,
  RemoteBackendException,
  RemoteDependencyException,
} from '@hublo/exceptions'

import type { BFFWorkerAppConfig } from '../../../../app/config/bff-worker-app.config'
import type { ExampleProvider } from '../../domain/provider-contracts/example.contract'
import type { Example } from '../../domain/types/example.types'

@Injectable()
export class ExampleProviderHttpImpl implements ExampleProvider {
  constructor(
    @Inject(AppConfig)
    private readonly config: BFFWorkerAppConfig,
    private readonly httpService: HttpService,
  ) {}

  async getExample(
    hubloId: string,
  ): Promise<Example> {
    const url = \`\${this.config.monorepoBaseUrl}\${getPath(hubloId)}\`

    const response = await lastValueFrom(
      this.httpService
        .get<GetExampleSuccess>(url, {
          headers: {
            Authorization: \`Bearer \`,
          },
        })
        .pipe(map((result) => result.data))
        .pipe(
          catchError((err: AxiosError<{ message?: string }>) => {
            const status = err.response?.status
            if (status === 502) {
              throw new DatabaseQueryFailedException(err.message)
            }
            if (status === 404) {
              throw new NotFoundException(err.message)
            }
            throw new RemoteBackendException(url, err.message, err)
          }),
        ),
    )

    return response
  }
}`},{id:"mongo_provider",title:"Generate mongo Provider",regex:/(mongo|pg)\.provider\.ts$/,promptOneFile:"You should generate the code of the mongo provider file FILENAME. Prisma is used to make the queries.  ",prompt:"You should only generate the code of the provider files. A provider file contains 'provider.ts' in the name. You should not generate any other file.",example:`import { Injectable } from '@nestjs/common'
import {
  DatabaseQueryFailedException,
  EntityNotFoundException,
} from '@hublo/exceptions'

import { ExampleDatabaseService } from '../../../app/database/example-database.service'

import type { ExampleProvider } from '../../domain/provider-contracts/example.contract'
import type { Example } from '../../domain/types/example.types'

@Injectable()
export class ExampleProviderMongoImpl implements ExampleProvider {
  constructor(private readonly database: ExampleDatabaseService) {}

  async getExample(
    id: string,
  ): Promise<Example> {
    const example = await this.database.example
      .findUnique({
        where: {
          id: id,
        },
      })
      .catch((err) => {
        throw new DatabaseQueryFailedException(err)
      })
    if (!example) {
      throw new EntityNotFoundException()
    }

    return {
      ...example,
      description: example.description ?? undefined,
    }
  }
}`},{id:"provider-unit-test",title:"Generate Provider Unit Test",regex:/provider\.spec\.ts$/,promptOneFile:"You should generate the code of the provider unit test file FILENAME. ",prompt:"You should only generate the code of the unit test files of the providers. The unit test files of the provider contains 'provider.spec.ts' in the name. You should not generate any other file.",example:`import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import type { TestingModule } from '@nestjs/testing'
import { rest } from 'msw'

import { getPath } from '@hublo/api-types/service-example/GetExampleController/getExample'
import { authenticatedWorker } from '@hublo/auth'
import { AppConfig } from '@hublo/configuration'
import {
  DatabaseQueryFailedException,
  RemoteDependencyException,
  ResourceAccessException,
} from '@hublo/exceptions'
import { HttpServiceModule } from '@hublo/http/http.module'
import { AppLoggerModule } from '@hublo/logs'
import { server } from '@hublo/test/msw/server'

import type { BFFWorkerAppConfig } from '../../../../app/config/bff-worker-app.config'
import { BffWorkerTestWrapper } from '../../../../app/test/bff-worker.test-wrapper'
import { mockedExample } from '../../domain/mocks/mocks.mock'

import { ExampleProviderHttpImpl } from './example.provider'

describe('Example provider', () => {
  let exampleProvider: ExampleProviderHttpImpl
  let module: TestingModule
  let config: BFFWorkerAppConfig

  beforeAll(async () => {
    module = await BffWorkerTestWrapper.createTestingModule({
      imports: [HttpServiceModule, AppLoggerModule],
      providers: [ExampleProviderHttpImpl],
    })
      .overrideProvider(REQUEST)
      .useValue({ authInfo: { token: 'token' } })
      .compile()

    exampleProvider = await module.resolve(ExampleProviderHttpImpl)
    config = module.get<BFFWorkerAppConfig>(AppConfig)
  })

  it('should be defined', () => {
    // then
    expect(exampleProvider).toBeDefined()
  })

  describe('Get example', () => {
    it('should returns example when successful', async () => {
      const idHubler = authenticatedWorker.hubloId
      // given
      server.use(
        rest.get(
          \`\${config.monorepoBaseUrl}\${getPath(idHubler)}\`,
          (_, res, ctx) => res(ctx.status(204), ctx.json(mockedExample)),
        ),
      )

      // when & then
      const result = await exampleProvider.getExample(idHubler)
      expect(result.result).toBe(mockedExample)
    })

    it('should throw DatabaseQueryFailedException', async () => {
      // given
      const idHubler = authenticatedWorker.hubloId
      server.use(
        rest.get(
          \`\${config.monorepoBaseUrl}\${getPath(idHubler)}\`,
          (_, res, ctx) => res(ctx.status(502), ctx.json({})),
        ),
      )

    it('should throw NotFoundException', async () => {
      // given
      const idHubler = authenticatedWorker.hubloId
      // given
      server.use(
        rest.get(
          \`\${config.monorepoBaseUrl}\${getPath(idHubler)}\`,
          (_, res, ctx) => res(ctx.status(404), ctx.json({})),
        ),
      )

      // when
      const output = exampleProvider.getExample(idHubler)

      // then
      await expect(output).rejects.toThrow(NotFoundException)
    })
  })
})`},{id:"response-dto",title:"Generate response DTO",regex:/response\.dto\.ts$/,promptOneFile:"You should generate the code of the DTO file FILENAME. Each ApiProperty should have a description and an example. You should use ApiPropertyOptional if the field is optional. Each field should be decorated with @Expose(). Each DTO class should be decorated with @Exclude(). A DTO should not have a type Object, you should create another DTO class in the file to replace the type object, like author in the following example. ",prompt:"You should only generate the code of the DTO files. The DTO files contains '.dto.ts' in the name. You should not generate any other file.",example:`import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

@Exclude()
class AuthorResponseDto {
  @Expose()
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'The author ID',
  })
  id: string
  
  @Expose()
  @ApiProperty({
    type: String,
    example: 'author',
    description: 'The author name',
  })
  name: string
}

@Exclude()
class ExampleCommentResponseDto {
  @Expose()
  @ApiProperty({
    type: () => AuthorResponseDto,
    description: 'The comment author',
  })
  author: AuthorResponseDto

  @Expose()
  @ApiProperty({
    type: String,
    example: 'bla bla bla',
    description: 'The comment text',
  })
  text: string
}

@Exclude()
export class ExampleResponseDto {
  @Expose()
  @ApiProperty({ type: Number, example: 1, description: 'The example id' })
  id: number

  @Expose()
  @ApiPropertyOptional({
    type: String,
    example: 'Super example',
    description: 'The example description',
  })
  description?: string

  @Expose()
  @ApiProperty({
    type: String,
    example: '2023-03-10T12:00:00.000Z',
    format: 'date-time',
    description: 'The created at date',
  })
  createdAt: string
  
  @Expose()
  @ApiProperty({
    type: () => AuthorResponseDto,
    description: 'The example author',
  })
  author: AuthorResponseDto

  @Expose()
  @ApiProperty({
    type: [ExampleCommentResponseDto],
    description: 'The comments',
  })
  comments: ExampleCommentResponseDto[]
}`},{id:"query-dto",title:"Generate Query DTO",regex:/query\.dto\.ts$/,promptOneFile:"You should generate the code of the DTO file FILENAME. Each ApiProperty should have a description and an example. You should use ApiPropertyOptional if the field is optional. Each field should be decorated with @Expose(). Each DTO class should be decorated with @Exclude(). A DTO should not have a type Object, you should create another DTO class in the file to replace the type object, like author in the following example. ",prompt:"You should only generate the code of the DTO files. The DTO files contains '.dto.ts' in the name. You should not generate any other file.",example:`import { ApiPropertyOptional } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'
import { IsInt, IsString, IsOptional } from 'class-validator'

@Exclude()
export class GetExampleQueryDto {
  @ApiPropertyOptional({
    name: 'idAuthor',
    type: String,
    example: '3c21a776-2c0c-4a57-b311-ad2b8a021f0f',
  })
  @Expose()
  @IsString()
  @IsOptional()
  idAuthor?: string

  @Expose()
  @ApiPropertyOptional({
    type: String,
    example: '2023-03-10T12:00:00.000Z',
    format: 'date-time',
    description: 'The created at date',
  })
  @IsOptional()
  @IsString()
  createdAt?: string
}`},{id:"interceptor",title:"Generate interceptor",regex:/nest\/.*\.interceptor\.ts$/,promptOneFile:"You should generate the code of the interceptor file FILENAME. ",prompt:"You should only generate the code of the interceptor files. The interceptor files contains '.interceptor.ts' in the name. You should not generate any other file.",example:`import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
  ServiceUnavailableException,
} from '@nestjs/common'
import type { Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'

import {
  DatabaseQueryFailedException,
  RemoteBackendException,
  RemoteDependencyException,
  ResourceAccessException,
} from '@hublo/exceptions'
import type { CustomError } from '@hublo/utils'

@Injectable()
export class GetExampleInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<void> {
    return next.handle().pipe(
        catchError((err: CustomError) => {
          switch (err.constructor) {
            case ResourceAccessException:
              throw new ForbiddenException(err.message)
            case RemoteBackendException:
              throw new ServiceUnavailableException(err.message)
            case RemoteDependencyException:
              throw err.toHttpException(500)
            case DatabaseQueryFailedException:
              throw err.toHttpException(502)
            default:
              throw err
          }
        }),
    )
  }
}`},{id:"types",title:"Generate types",regex:/domain\/types\/.*\.ts$/,promptOneFile:"You should generate the code of the types file FILENAME. ",prompt:"You should only generate the code of the types files. The types files contains '.types.ts' in the name. You should not generate any other file.",example:`export type Example = {
  id: number
  description?: string
  createdAt: string
  authorName: string
}`},{id:"exception",title:"Generate exception",regex:/\.exception\.ts$/,promptOneFile:"You should generate the code of the exception file FILENAME. The exception extends CustomError.  ",prompt:"You should only generate the code of the types files. The types files contains '.types.ts' in the name. You should not generate any other file.",example:`import { CustomError } from '@hublo/utils/customError'

export class ExampleNotFound extends CustomError {
  constructor(idExample: string) {
    super({
      name: 'ExampleNotFound',
      message: \`We could not find an example with id = \${idExample}\`,
    })
  }
}
`},{id:"react-query-hook",title:"Generate react-query hook",regex:/libs\/front\/api\/src\/.*\/use.*\.ts$/,promptOneFile:"You should generate the code of the react hook file FILENAME. This hook is used to call the endpoint given on the specification. We use @tanstack/react-query to handle the request. ",example:`import type { QueryObserverResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import type {
    GetExampleSuccess,
    GetExampleError,
} from '@hublo/api-types/bff-worker/GetExampleController/getExample'

import { axiosGet } from '../logic/axios/wrappers/axios.get.wrapper'

import { getExampleUrl } from './config'

export const getExampleKey = 'get-example'

export const useWorkerOffersQuery = (
    enabled = true,
): QueryObserverResult<GetExampleSuccess, GetExampleError> =>
    useQuery(
        [getExampleKey],
        () => axiosGet<GetExampleSuccess>(getExampleUrl),
        {
            enabled,
        },
    )`},{id:"msw-interceptor",title:"Generate MSW interceptor",regex:/libs\/front\/api\/src\/msw-handlers\/.*\.interceptor\.ts$/,promptOneFile:"You should generate the code of the MSW handler file FILENAME. This hook is used in unit tests to catch the call of the endpoint given on the specification. ",example:`import type { GetExampleSuccess } from '@hublo/api-types/bff-worker/GetExampleController/getExample'

import { genericGetHandler } from '../../logic/msw/handlers'
import { getExampleUrl } from '../../worker-bff/config'

export const getExample = (
    status: number,
    result: GetExampleSuccess,
    applyToServer = true,
): void =>
    genericGetHandler({
        url: getExampleUrl,
        status,
        result,
        applyToServer,
    })
`},{id:"react-query-config",title:"Generate react-query config",regex:/libs\/front\/api\/src\/.*\/config\.ts$/,promptOneFile:"In the file FILENAME, you should add the code of the endpoint URL from the given specifications. You should generate the import and the export. You should use a double chevron on the echo command to not erase the existing content. ",example:"import { path as getExamplePath } from '@hublo/api-types/bff-worker/GetExampleController/getExample'\nexport const getExampleUrl = `${monorepoBaseUrl}${getExamplePath}`\n"},{id:"react-import-msw-handler",title:"Import MSW handler",regex:/libs\/front\/api\/src\/msw-handlers\/.*\/index\.ts$/,promptOneFile:"In the file FILENAME, you should only import the msw interceptor. You should not do anything else. You should use a double chevron on the echo command to not erase the existing content. ",example:"import { getExample } from './getExample.interceptor'"},{id:"react-export-hook",title:"Export react hook",regex:/libs\/front\/api\/src\/(?!msw-handlers\/).*\/index\.ts$/,promptOneFile:"In the file FILENAME, you should only export the react hook. You should not do anything else. You should use a double chevron on the echo command to not erase the existing content. ",example:"export * from './useGetExample'"}];async function f(e,a,r){const t=await l(e,"You should create all the folders and files. You should not write anything in the files. You should only use mkdir and touch commands. ",a);if(!t)return;const n=t.split(`
`).filter(o=>o.startsWith('echo "" >')||o.startsWith("touch ")).map(o=>o.replace('echo "" >',"").replace("touch ","")),i=(await Promise.all(n.map(async o=>{const s=x.find(m=>m.regex&&m.regex.test(o));if(!s||!s.promptOneFile){console.log(`no nest file description found for ${o}`);return}const p=await l(e,`${s.promptOneFile.replace("FILENAME",o)}. You should not write any other file. You should understand this example of code: "${s.example}". You should transform this example to match the specifications. `,a);return console.log(`${o} loaded`),console.log(p),{id:s.id,title:s.title,result:p==null?void 0:p.replace(`bash
`,"")}}))).filter(o=>o!==void 0);console.log("results"),console.log(i);const c=`eslint ${n.map(o=>o).join(" ")} --fix`;console.log("eslintCommand",c),await chrome.storage.local.set({commands:[t,...i.map(o=>o==null?void 0:o.result),c].join(`
`),lastPageGenerated:r})}async function E(e,a,r,t){const n=await l(e,a,r);await chrome.storage.local.set({commands:n,lastPageGenerated:t})}chrome.runtime.onMessage.addListener(async e=>{const a=y();if(e.command==="callChatGPT"){await chrome.storage.local.set({loading:!0});try{const{content:r,id:t}=await u();await chrome.storage.local.set({currentPrompt:e.currentPrompt}),e.currentPrompt?await E(e.technology||"NestJS",e.currentPrompt,r,t):await f(e.technology||"NestJS",r,t)}catch(r){console.error("Error generating commands from AI:",r)}await chrome.storage.local.set({loading:!1}),chrome.notifications.create("commandsGenerated",{type:"basic",iconUrl:"assets/rocket.png",title:"Commands Generated!",message:"The shell commands have been generated. Click the button below to copy them to your clipboard.",priority:0})}clearInterval(a)});async function g(){return chrome.windows.create({focused:!0,type:"popup",url:"popup.html",width:530,height:511})}chrome.notifications.onClicked.addListener(g);chrome.runtime.onInstalled.addListener(({reason:e})=>{console.log("onInstalled",e),chrome.storage.local.remove(["commands","lastPageGenerated","loading"])});const y=()=>setInterval(chrome.runtime.getPlatformInfo,2e4);
