# Phase 0 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a running, fully-wired but feature-empty full-stack monorepo skeleton that every later phase builds on.

**Architecture:** pnpm-workspace monorepo with three packages: `apps/api` (NestJS, layered Controller→Service→Repository, TypeORM/PostgreSQL), `apps/web` (React + Vite + Tailwind + React Router + TanStack Query + react-i18next), and `packages/shared` (TypeScript types/DTOs imported by both). A trivial "health" feature is implemented end-to-end (shared type → API endpoint → web page) to prove the wiring, with tests at every layer.

**Tech Stack:** pnpm, TypeScript 5, NestJS 11, TypeORM 0.3 + PostgreSQL (Docker), Jest + Supertest, React 19, Vite 6, Tailwind CSS 3.4, React Router 7, TanStack Query 5, react-i18next, Vitest + React Testing Library, ESLint + Prettier, GitHub Actions CI.

---

## File Structure

```
/ (repo root)
  package.json                 # root workspace scripts + dev tooling
  pnpm-workspace.yaml          # workspace globs
  tsconfig.base.json           # shared compiler options
  .editorconfig
  .prettierrc.json
  .nvmrc
  docker-compose.yml           # postgres for local dev
  .env.example                 # documented env vars
  .github/workflows/ci.yml     # install, lint, test, build
  README.md

  packages/shared/
    package.json
    tsconfig.json
    src/index.ts               # barrel
    src/health.ts              # HealthStatus type (sample shared contract)
    src/health.test.ts

  apps/api/
    package.json
    tsconfig.json
    tsconfig.build.json
    nest-cli.json
    jest.config.js
    .env                       # local only (gitignored)
    src/main.ts                # bootstrap + global pipe/filter/CORS
    src/app.module.ts
    src/config/configuration.ts
    src/common/api-response.ts          # response envelope helper + type
    src/common/all-exceptions.filter.ts # global exception → envelope
    src/common/all-exceptions.filter.spec.ts
    src/database/data-source.ts         # TypeORM DataSource for CLI/migrations
    src/database/migrations/.gitkeep
    src/health/health.controller.ts
    src/health/health.service.ts
    src/health/health.service.spec.ts
    src/health/health.module.ts
    test/health.e2e-spec.ts
    test/jest-e2e.json

  apps/web/
    package.json
    tsconfig.json
    tsconfig.node.json
    vite.config.ts
    vitest.setup.ts
    tailwind.config.js
    postcss.config.js
    index.html
    src/main.tsx
    src/App.tsx
    src/router.tsx
    src/index.css
    src/lib/queryClient.ts
    src/lib/apiClient.ts          # typed fetch wrapper using shared types
    src/i18n/index.ts
    src/i18n/locales/en.json
    src/i18n/locales/bg.json
    src/ui/Button.tsx
    src/ui/Button.test.tsx
    src/components/Layout.tsx     # header + footer shell
    src/components/LanguageSwitcher.tsx
    src/features/health/HealthPage.tsx
    src/features/health/HealthPage.test.tsx
```

---

## Task 1: Root monorepo scaffold

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `.editorconfig`
- Create: `.prettierrc.json`
- Create: `.nvmrc`

- [ ] **Step 1: Create `pnpm-workspace.yaml`**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

- [ ] **Step 2: Create root `package.json`**

```json
{
  "name": "decathlon-clone",
  "version": "0.0.0",
  "private": true,
  "packageManager": "pnpm@9.12.0",
  "engines": { "node": ">=20" },
  "scripts": {
    "dev": "pnpm --parallel -r dev",
    "build": "pnpm -r build",
    "lint": "pnpm -r lint",
    "test": "pnpm -r test",
    "format": "prettier --write \"**/*.{ts,tsx,json,md,css}\""
  },
  "devDependencies": {
    "prettier": "^3.3.3",
    "typescript": "^5.6.2"
  }
}
```

- [ ] **Step 3: Create `tsconfig.base.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "sourceMap": true
  }
}
```

- [ ] **Step 4: Create `.editorconfig`**

```ini
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
```

- [ ] **Step 5: Create `.prettierrc.json`**

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "semi": true
}
```

- [ ] **Step 6: Create `.nvmrc`**

```
20
```

- [ ] **Step 7: Install root deps and verify pnpm sees the workspace**

Run: `pnpm install`
Expected: completes without error; creates `pnpm-lock.yaml` and `node_modules/`.

Run: `pnpm -r list --depth -1`
Expected: lists the workspace root (child packages added in later tasks).

- [ ] **Step 8: Commit**

```bash
git add package.json pnpm-workspace.yaml tsconfig.base.json .editorconfig .prettierrc.json .nvmrc pnpm-lock.yaml
git commit -m "chore: scaffold pnpm monorepo root"
```

---

## Task 2: Shared package with sample contract

**Files:**
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/shared/src/health.ts`
- Create: `packages/shared/src/index.ts`
- Test: `packages/shared/src/health.test.ts`

- [ ] **Step 1: Create `packages/shared/package.json`**

```json
{
  "name": "@decathlon/shared",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": { ".": "./src/index.ts" },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "lint": "eslint src --max-warnings 0",
    "test": "vitest run"
  },
  "devDependencies": {
    "vitest": "^2.1.1"
  }
}
```

- [ ] **Step 2: Create `packages/shared/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "noEmit": false
  },
  "include": ["src"],
  "exclude": ["**/*.test.ts"]
}
```

- [ ] **Step 3: Write the failing test `packages/shared/src/health.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { makeHealthStatus, type HealthStatus } from './health';

describe('makeHealthStatus', () => {
  it('builds an ok status with the given service name', () => {
    const status: HealthStatus = makeHealthStatus('api');
    expect(status.status).toBe('ok');
    expect(status.service).toBe('api');
    expect(typeof status.timestamp).toBe('string');
  });
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `pnpm --filter @decathlon/shared test`
Expected: FAIL — cannot resolve `./health` / `makeHealthStatus` is not defined.

- [ ] **Step 5: Implement `packages/shared/src/health.ts`**

```ts
export interface HealthStatus {
  status: 'ok';
  service: string;
  timestamp: string;
}

export function makeHealthStatus(service: string): HealthStatus {
  return { status: 'ok', service, timestamp: new Date().toISOString() };
}
```

- [ ] **Step 6: Create the barrel `packages/shared/src/index.ts`**

```ts
export * from './health';
```

- [ ] **Step 7: Install and run the test to verify it passes**

Run: `pnpm install`
Run: `pnpm --filter @decathlon/shared test`
Expected: PASS (1 test).

- [ ] **Step 8: Verify the package builds**

Run: `pnpm --filter @decathlon/shared build`
Expected: emits `packages/shared/dist/` with no errors.

- [ ] **Step 9: Commit**

```bash
git add packages/shared pnpm-lock.yaml
git commit -m "feat(shared): add HealthStatus contract and shared package"
```

---

## Task 3: NestJS API scaffold + config

**Files:**
- Create: `apps/api/package.json`
- Create: `apps/api/tsconfig.json`
- Create: `apps/api/tsconfig.build.json`
- Create: `apps/api/nest-cli.json`
- Create: `apps/api/jest.config.js`
- Create: `apps/api/src/config/configuration.ts`
- Create: `apps/api/src/app.module.ts`
- Create: `apps/api/src/main.ts`

- [ ] **Step 1: Create `apps/api/package.json`**

```json
{
  "name": "@decathlon/api",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start": "node dist/main.js",
    "lint": "eslint src --max-warnings 0",
    "test": "jest",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "typeorm": "typeorm-ts-node-commonjs -d src/database/data-source.ts",
    "migration:generate": "pnpm typeorm migration:generate",
    "migration:run": "pnpm typeorm migration:run"
  },
  "dependencies": {
    "@decathlon/shared": "workspace:*",
    "@nestjs/common": "^11.0.0",
    "@nestjs/config": "^4.0.0",
    "@nestjs/core": "^11.0.0",
    "@nestjs/platform-express": "^11.0.0",
    "@nestjs/typeorm": "^11.0.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "pg": "^8.13.0",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1",
    "typeorm": "^0.3.20"
  },
  "devDependencies": {
    "@nestjs/cli": "^11.0.0",
    "@nestjs/schematics": "^11.0.0",
    "@nestjs/testing": "^11.0.0",
    "@types/express": "^5.0.0",
    "@types/jest": "^29.5.13",
    "@types/node": "^20.16.10",
    "@types/supertest": "^6.0.2",
    "jest": "^29.7.0",
    "supertest": "^7.0.0",
    "ts-jest": "^29.2.5",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.6.2"
  }
}
```

- [ ] **Step 2: Create `apps/api/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "CommonJS",
    "moduleResolution": "Node",
    "target": "ES2021",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "noEmit": false
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "test", "**/*.spec.ts"]
}
```

- [ ] **Step 3: Create `apps/api/tsconfig.build.json`**

```json
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "test", "dist", "**/*.spec.ts", "**/*.e2e-spec.ts"]
}
```

- [ ] **Step 4: Create `apps/api/nest-cli.json`**

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": { "deleteOutDir": true }
}
```

- [ ] **Step 5: Create `apps/api/jest.config.js`**

```js
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};
```

- [ ] **Step 6: Create `apps/api/src/config/configuration.ts`**

```ts
export interface AppConfig {
  port: number;
  webOrigin: string;
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
  };
}

export default (): AppConfig => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  webOrigin: process.env.WEB_ORIGIN ?? 'http://localhost:5173',
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USER ?? 'decathlon',
    password: process.env.DB_PASSWORD ?? 'decathlon',
    name: process.env.DB_NAME ?? 'decathlon',
  },
});
```

- [ ] **Step 7: Create `apps/api/src/app.module.ts`** (database wiring added in Task 6; minimal for now)

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    HealthModule,
  ],
})
export class AppModule {}
```

- [ ] **Step 8: Create `apps/api/src/main.ts`**

```ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({ origin: config.get<string>('webOrigin'), credentials: true });
  await app.listen(config.get<number>('port') ?? 3000);
}
void bootstrap();
```

- [ ] **Step 9: Install dependencies**

Run: `pnpm install`
Expected: installs NestJS toolchain; `@decathlon/shared` linked via `workspace:*`.

Note: `main.ts` references `AllExceptionsFilter` and `health.module`, created in Tasks 4 and 5. The app will not compile until those exist — that is expected; do not run the API yet.

- [ ] **Step 10: Commit**

```bash
git add apps/api/package.json apps/api/tsconfig.json apps/api/tsconfig.build.json apps/api/nest-cli.json apps/api/jest.config.js apps/api/src/config apps/api/src/app.module.ts apps/api/src/main.ts pnpm-lock.yaml
git commit -m "chore(api): scaffold NestJS app shell and config"
```

---

## Task 4: Global response envelope + exception filter

**Files:**
- Create: `apps/api/src/common/api-response.ts`
- Create: `apps/api/src/common/all-exceptions.filter.ts`
- Test: `apps/api/src/common/all-exceptions.filter.spec.ts`

- [ ] **Step 1: Create `apps/api/src/common/api-response.ts`**

```ts
export interface ApiErrorBody {
  statusCode: number;
  message: string;
  path: string;
  timestamp: string;
}
```

- [ ] **Step 2: Write the failing test `apps/api/src/common/all-exceptions.filter.spec.ts`**

```ts
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';

function mockHost(url: string) {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const host = {
    switchToHttp: () => ({
      getResponse: () => ({ status }),
      getRequest: () => ({ url }),
    }),
  } as unknown as ArgumentsHost;
  return { host, status, json };
}

describe('AllExceptionsFilter', () => {
  it('maps an HttpException to the error envelope', () => {
    const filter = new AllExceptionsFilter();
    const { host, status, json } = mockHost('/api/test');
    filter.catch(new HttpException('boom', HttpStatus.BAD_REQUEST), host);
    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, message: 'boom', path: '/api/test' }),
    );
  });

  it('maps an unknown error to a 500 envelope', () => {
    const filter = new AllExceptionsFilter();
    const { host, status, json } = mockHost('/api/test');
    filter.catch(new Error('unexpected'), host);
    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 500 }));
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `pnpm --filter @decathlon/api test`
Expected: FAIL — cannot find `./all-exceptions.filter`.

- [ ] **Step 4: Implement `apps/api/src/common/all-exceptions.filter.ts`**

```ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiErrorBody } from './api-response';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? this.extractMessage(exception)
        : 'Internal server error';

    const body: ApiErrorBody = {
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };
    response.status(status).json(body);
  }

  private extractMessage(exception: HttpException): string {
    const res = exception.getResponse();
    if (typeof res === 'string') return res;
    if (typeof res === 'object' && res !== null && 'message' in res) {
      const m = (res as { message: unknown }).message;
      return Array.isArray(m) ? m.join(', ') : String(m);
    }
    return exception.message;
  }
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm --filter @decathlon/api test`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add apps/api/src/common
git commit -m "feat(api): add error envelope and global exception filter"
```

---

## Task 5: Health module end-to-end (consumes shared type)

**Files:**
- Create: `apps/api/src/health/health.service.ts`
- Test: `apps/api/src/health/health.service.spec.ts`
- Create: `apps/api/src/health/health.controller.ts`
- Create: `apps/api/src/health/health.module.ts`
- Create: `apps/api/test/health.e2e-spec.ts`
- Create: `apps/api/test/jest-e2e.json`

- [ ] **Step 1: Write the failing test `apps/api/src/health/health.service.spec.ts`**

```ts
import { HealthService } from './health.service';

describe('HealthService', () => {
  it('returns an ok status for the api service', () => {
    const result = new HealthService().check();
    expect(result.status).toBe('ok');
    expect(result.service).toBe('api');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm --filter @decathlon/api test`
Expected: FAIL — cannot find `./health.service`.

- [ ] **Step 3: Implement `apps/api/src/health/health.service.ts`**

```ts
import { Injectable } from '@nestjs/common';
import { makeHealthStatus, type HealthStatus } from '@decathlon/shared';

@Injectable()
export class HealthService {
  check(): HealthStatus {
    return makeHealthStatus('api');
  }
}
```

- [ ] **Step 4: Implement `apps/api/src/health/health.controller.ts`**

```ts
import { Controller, Get } from '@nestjs/common';
import { type HealthStatus } from '@decathlon/shared';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  check(): HealthStatus {
    return this.healthService.check();
  }
}
```

- [ ] **Step 5: Implement `apps/api/src/health/health.module.ts`**

```ts
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
```

- [ ] **Step 6: Run the unit test to verify it passes**

Run: `pnpm --filter @decathlon/api test`
Expected: PASS (HealthService + AllExceptionsFilter tests).

- [ ] **Step 7: Create `apps/api/test/jest-e2e.json`**

```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": { "^.+\\.(t|j)s$": "ts-jest" }
}
```

- [ ] **Step 8: Write the e2e test `apps/api/test/health.e2e-spec.ts`**

```ts
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { HealthModule } from '../src/health/health.module';

describe('Health (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [HealthModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/health returns ok', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
        expect(res.body.service).toBe('api');
      });
  });
});
```

- [ ] **Step 9: Run the e2e test to verify it passes**

Run: `pnpm --filter @decathlon/api test:e2e`
Expected: PASS (1 test).

- [ ] **Step 10: Build the API to confirm it compiles end-to-end**

Run: `pnpm --filter @decathlon/api build`
Expected: emits `apps/api/dist/` with no TypeScript errors.

- [ ] **Step 11: Commit**

```bash
git add apps/api/src/health apps/api/test
git commit -m "feat(api): add health endpoint consuming shared contract"
```

---

## Task 6: PostgreSQL (Docker) + TypeORM DataSource + migrations

**Files:**
- Create: `docker-compose.yml`
- Create: `.env.example`
- Create: `apps/api/.env`
- Create: `apps/api/src/database/data-source.ts`
- Create: `apps/api/src/database/migrations/.gitkeep`
- Modify: `apps/api/src/app.module.ts`

- [ ] **Step 1: Create `docker-compose.yml`**

```yaml
services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: decathlon
      POSTGRES_PASSWORD: decathlon
      POSTGRES_DB: decathlon
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
volumes:
  db_data:
```

- [ ] **Step 2: Create `.env.example`**

```bash
# API
PORT=3000
WEB_ORIGIN=http://localhost:5173

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=decathlon
DB_PASSWORD=decathlon
DB_NAME=decathlon

# Web (Vite)
VITE_API_URL=http://localhost:3000/api
```

- [ ] **Step 3: Create `apps/api/.env`** (gitignored — local dev values)

```bash
PORT=3000
WEB_ORIGIN=http://localhost:5173
DB_HOST=localhost
DB_PORT=5432
DB_USER=decathlon
DB_PASSWORD=decathlon
DB_NAME=decathlon
```

- [ ] **Step 4: Create `apps/api/src/database/data-source.ts`** (used by both the app and the TypeORM CLI)

```ts
import 'reflect-metadata';
import { config as loadEnv } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

loadEnv();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USER ?? 'decathlon',
  password: process.env.DB_PASSWORD ?? 'decathlon',
  database: process.env.DB_NAME ?? 'decathlon',
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: false,
};

export default new DataSource(dataSourceOptions);
```

- [ ] **Step 5: Add `dotenv` dependency to the API**

Run: `pnpm --filter @decathlon/api add dotenv@^16.4.5`
Expected: adds `dotenv` to `apps/api/package.json` dependencies.

- [ ] **Step 6: Create the migrations directory keeper `apps/api/src/database/migrations/.gitkeep`**

```
```
(empty file)

- [ ] **Step 7: Wire TypeORM into `apps/api/src/app.module.ts`**

Replace the file contents with:

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { dataSourceOptions } from './database/data-source';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRoot(dataSourceOptions),
    HealthModule,
  ],
})
export class AppModule {}
```

- [ ] **Step 8: Start PostgreSQL**

Run: `docker compose up -d`
Run: `docker compose ps`
Expected: the `db` service is running and healthy on port 5432.

- [ ] **Step 9: Verify the API boots and connects to the database**

Run (from repo root): `pnpm --filter @decathlon/api build && node apps/api/dist/main.js`
Expected: logs `Nest application successfully started` with no TypeORM connection errors. Stop with Ctrl+C.

- [ ] **Step 10: Verify the health endpoint over HTTP**

In a second terminal, run: `curl -s http://localhost:3000/api/health`
Expected: JSON like `{"status":"ok","service":"api","timestamp":"..."}`. Then stop the server.

- [ ] **Step 11: Commit**

```bash
git add docker-compose.yml .env.example apps/api/src/database apps/api/src/app.module.ts apps/api/package.json pnpm-lock.yaml
git commit -m "feat(api): add Postgres docker-compose and TypeORM datasource"
```

---

## Task 7: React + Vite + TypeScript scaffold

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/tsconfig.node.json`
- Create: `apps/web/vite.config.ts`
- Create: `apps/web/index.html`
- Create: `apps/web/src/main.tsx`
- Create: `apps/web/src/App.tsx`

- [ ] **Step 1: Create `apps/web/package.json`**

```json
{
  "name": "@decathlon/web",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint src --max-warnings 0",
    "test": "vitest run"
  },
  "dependencies": {
    "@decathlon/shared": "workspace:*",
    "@tanstack/react-query": "^5.59.0",
    "i18next": "^23.15.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-i18next": "^15.0.2",
    "react-router-dom": "^7.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.5.0",
    "@testing-library/react": "^16.0.1",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.2",
    "autoprefixer": "^10.4.20",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.13",
    "typescript": "^5.6.2",
    "vite": "^6.0.0",
    "vitest": "^2.1.1"
  }
}
```

- [ ] **Step 2: Create `apps/web/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vitest/globals", "@testing-library/jest-dom"],
    "noEmit": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 3: Create `apps/web/tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "skipLibCheck": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Create `apps/web/vite.config.ts`**

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
  },
});
```

- [ ] **Step 5: Create `apps/web/index.html`**

```html
<!doctype html>
<html lang="bg">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Decathlon Clone</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create `apps/web/src/App.tsx`** (replaced in Task 9 with the router; minimal placeholder now)

```tsx
export default function App() {
  return <div>Decathlon Clone</div>;
}
```

- [ ] **Step 7: Create `apps/web/src/main.tsx`** (expanded in later tasks)

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 8: Install dependencies**

Run: `pnpm install`
Expected: installs React/Vite toolchain; links `@decathlon/shared`.

- [ ] **Step 9: Verify the dev build compiles**

Run: `pnpm --filter @decathlon/web build`
Expected: type-checks and produces `apps/web/dist/` with no errors.

- [ ] **Step 10: Commit**

```bash
git add apps/web/package.json apps/web/tsconfig.json apps/web/tsconfig.node.json apps/web/vite.config.ts apps/web/index.html apps/web/src/App.tsx apps/web/src/main.tsx pnpm-lock.yaml
git commit -m "chore(web): scaffold React + Vite + TypeScript app"
```

---

## Task 8: Tailwind CSS setup

**Files:**
- Create: `apps/web/tailwind.config.js`
- Create: `apps/web/postcss.config.js`
- Create: `apps/web/src/index.css`
- Modify: `apps/web/src/main.tsx`

- [ ] **Step 1: Create `apps/web/tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Decathlon-like primary blue; refined in Phase 2 design system
        brand: { DEFAULT: '#3643ba', dark: '#2a3490' },
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2: Create `apps/web/postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 3: Create `apps/web/src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 4: Import the stylesheet in `apps/web/src/main.tsx`**

Add the import as the first line:

```tsx
import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 5: Verify Tailwind compiles into the build**

Run: `pnpm --filter @decathlon/web build`
Expected: build succeeds; the emitted CSS asset in `apps/web/dist/assets` contains Tailwind utility classes (e.g. search for `.flex` — `grep -rl "flex" apps/web/dist/assets`).

- [ ] **Step 6: Commit**

```bash
git add apps/web/tailwind.config.js apps/web/postcss.config.js apps/web/src/index.css apps/web/src/main.tsx
git commit -m "chore(web): configure Tailwind CSS"
```

---

## Task 9: Router + TanStack Query + Layout shell

**Files:**
- Create: `apps/web/src/lib/queryClient.ts`
- Create: `apps/web/src/components/Layout.tsx`
- Create: `apps/web/src/router.tsx`
- Modify: `apps/web/src/App.tsx`
- Modify: `apps/web/src/main.tsx`

- [ ] **Step 1: Create `apps/web/src/lib/queryClient.ts`**

```ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});
```

- [ ] **Step 2: Create `apps/web/src/components/Layout.tsx`** (header/footer shell; `LanguageSwitcher` added in Task 10)

```tsx
import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-brand text-white px-4 py-3 flex items-center gap-4">
        <Link to="/" className="text-xl font-bold tracking-wide">
          DECATHLON
        </Link>
      </header>
      <main className="flex-1 px-4 py-6">
        <Outlet />
      </main>
      <footer className="bg-gray-100 px-4 py-6 text-sm text-gray-600">
        Decathlon Clone — portfolio project
      </footer>
    </div>
  );
}
```

- [ ] **Step 3: Create `apps/web/src/router.tsx`** (HealthPage added in Task 12; use a temporary inline home route now)

```tsx
import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [{ index: true, element: <div>Home</div> }],
  },
]);
```

- [ ] **Step 4: Replace `apps/web/src/App.tsx`**

```tsx
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { router } from './router';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

- [ ] **Step 5: Verify the build compiles**

Run: `pnpm --filter @decathlon/web build`
Expected: succeeds with no type errors.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/lib/queryClient.ts apps/web/src/components/Layout.tsx apps/web/src/router.tsx apps/web/src/App.tsx
git commit -m "feat(web): add router, query client, and layout shell"
```

---

## Task 10: i18n (BG/EN) + language switcher

**Files:**
- Create: `apps/web/src/i18n/locales/en.json`
- Create: `apps/web/src/i18n/locales/bg.json`
- Create: `apps/web/src/i18n/index.ts`
- Create: `apps/web/src/components/LanguageSwitcher.tsx`
- Modify: `apps/web/src/main.tsx`
- Modify: `apps/web/src/components/Layout.tsx`

- [ ] **Step 1: Create `apps/web/src/i18n/locales/en.json`**

```json
{
  "common": {
    "home": "Home",
    "language": "Language"
  }
}
```

- [ ] **Step 2: Create `apps/web/src/i18n/locales/bg.json`**

```json
{
  "common": {
    "home": "Начало",
    "language": "Език"
  }
}
```

- [ ] **Step 3: Create `apps/web/src/i18n/index.ts`**

```ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import bg from './locales/bg.json';

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    bg: { translation: bg },
  },
  lng: 'bg',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
```

- [ ] **Step 4: Create `apps/web/src/components/LanguageSwitcher.tsx`**

```tsx
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  return (
    <div className="ml-auto flex gap-2" aria-label="language switcher">
      {(['bg', 'en'] as const).map((lng) => (
        <button
          key={lng}
          type="button"
          onClick={() => void i18n.changeLanguage(lng)}
          className={`uppercase text-sm ${i18n.resolvedLanguage === lng ? 'font-bold underline' : ''}`}
        >
          {lng}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Initialize i18n in `apps/web/src/main.tsx`**

```tsx
import './index.css';
import './i18n';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 6: Add the switcher to `apps/web/src/components/Layout.tsx`**

```tsx
import { Outlet, Link } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-brand text-white px-4 py-3 flex items-center gap-4">
        <Link to="/" className="text-xl font-bold tracking-wide">
          DECATHLON
        </Link>
        <LanguageSwitcher />
      </header>
      <main className="flex-1 px-4 py-6">
        <Outlet />
      </main>
      <footer className="bg-gray-100 px-4 py-6 text-sm text-gray-600">
        Decathlon Clone — portfolio project
      </footer>
    </div>
  );
}
```

- [ ] **Step 7: Verify the build compiles**

Run: `pnpm --filter @decathlon/web build`
Expected: succeeds with no type errors.

- [ ] **Step 8: Commit**

```bash
git add apps/web/src/i18n apps/web/src/components/LanguageSwitcher.tsx apps/web/src/main.tsx apps/web/src/components/Layout.tsx
git commit -m "feat(web): add BG/EN i18n and language switcher"
```

---

## Task 11: UI primitive — Button (with component test)

**Files:**
- Create: `apps/web/vitest.setup.ts`
- Create: `apps/web/src/ui/Button.tsx`
- Test: `apps/web/src/ui/Button.test.tsx`

- [ ] **Step 1: Create `apps/web/vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 2: Write the failing test `apps/web/src/ui/Button.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Add to cart</Button>);
    expect(screen.getByRole('button', { name: 'Add to cart' })).toBeInTheDocument();
  });

  it('calls onClick when pressed', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Buy</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Buy' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `pnpm --filter @decathlon/web test`
Expected: FAIL — cannot find `./Button`.

- [ ] **Step 4: Implement `apps/web/src/ui/Button.tsx`**

```tsx
import { type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const styles: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  secondary: 'bg-white text-brand border border-brand hover:bg-gray-50',
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded px-4 py-2 font-medium transition-colors disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    />
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm --filter @decathlon/web test`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add apps/web/vitest.setup.ts apps/web/src/ui/Button.tsx apps/web/src/ui/Button.test.tsx
git commit -m "feat(web): add Button UI primitive with tests"
```

---

## Task 12: Health feature end-to-end (typed API client → page)

**Files:**
- Create: `apps/web/src/lib/apiClient.ts`
- Create: `apps/web/src/features/health/HealthPage.tsx`
- Test: `apps/web/src/features/health/HealthPage.test.tsx`
- Modify: `apps/web/src/router.tsx`

- [ ] **Step 1: Create `apps/web/src/lib/apiClient.ts`** (typed fetch using the shared contract)

```ts
import { type HealthStatus } from '@decathlon/shared';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
}

export const apiClient = {
  getHealth: () => getJson<HealthStatus>('/health'),
};
```

- [ ] **Step 2: Write the failing test `apps/web/src/features/health/HealthPage.test.tsx`**

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HealthPage from './HealthPage';
import { apiClient } from '../../lib/apiClient';

vi.mock('../../lib/apiClient', () => ({
  apiClient: { getHealth: vi.fn() },
}));

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe('HealthPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows the API status once loaded', async () => {
    vi.mocked(apiClient.getHealth).mockResolvedValue({
      status: 'ok',
      service: 'api',
      timestamp: '2026-06-08T00:00:00.000Z',
    });
    renderWithClient(<HealthPage />);
    await waitFor(() => expect(screen.getByText(/api: ok/i)).toBeInTheDocument());
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `pnpm --filter @decathlon/web test`
Expected: FAIL — cannot find `./HealthPage`.

- [ ] **Step 4: Implement `apps/web/src/features/health/HealthPage.tsx`**

```tsx
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';

export default function HealthPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['health'],
    queryFn: apiClient.getHealth,
  });

  if (isLoading) return <p>Checking…</p>;
  if (isError || !data) return <p>API unreachable</p>;

  return (
    <p>
      {data.service}: {data.status}
    </p>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm --filter @decathlon/web test`
Expected: PASS.

- [ ] **Step 6: Wire the page into `apps/web/src/router.tsx`**

```tsx
import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import HealthPage from './features/health/HealthPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <div>Home</div> },
      { path: 'health', element: <HealthPage /> },
    ],
  },
]);
```

- [ ] **Step 7: Verify the full web build compiles and all web tests pass**

Run: `pnpm --filter @decathlon/web build`
Expected: succeeds.
Run: `pnpm --filter @decathlon/web test`
Expected: PASS (Button + HealthPage).

- [ ] **Step 8: Manual end-to-end smoke test**

In terminal A: `docker compose up -d` then `pnpm --filter @decathlon/api dev`
In terminal B: `pnpm --filter @decathlon/web dev`
Open `http://localhost:5173/health` in a browser.
Expected: the page renders `api: ok` (proves shared type → API → web wiring). Stop both servers afterward.

- [ ] **Step 9: Commit**

```bash
git add apps/web/src/lib/apiClient.ts apps/web/src/features/health apps/web/src/router.tsx
git commit -m "feat(web): wire health page through typed API client"
```

---

## Task 13: Workspace ESLint configuration

**Files:**
- Create: `eslint.config.mjs` (repo root, flat config shared by all packages)
- Modify: root `package.json` (add lint devDependencies + root lint script)

- [ ] **Step 1: Add ESLint dependencies at the root**

Run:
```bash
pnpm add -w -D eslint@^9.11.1 typescript-eslint@^8.8.0 @eslint/js@^9.11.1 eslint-plugin-react-hooks@^5.0.0 eslint-config-prettier@^9.1.0 globals@^15.10.0
```
Expected: dependencies added to root `package.json` devDependencies.

- [ ] **Step 2: Create `eslint.config.mjs`**

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['**/dist/**', '**/coverage/**', '**/node_modules/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: { ...reactHooks.configs.recommended.rules },
  },
  prettier,
);
```

- [ ] **Step 3: Add a root lint script that lints every workspace**

In root `package.json`, ensure the `scripts` block contains:

```json
"lint": "eslint . --max-warnings 0"
```

(Replace the existing `lint` line from Task 1, which delegated to child packages, with this root-level lint.)

- [ ] **Step 4: Run lint across the repo and fix any reported issues**

Run: `pnpm lint`
Expected: completes with 0 errors and 0 warnings. If errors appear, fix them (commonly: unused imports, missing `type` on type-only imports) and re-run until clean.

- [ ] **Step 5: Commit**

```bash
git add eslint.config.mjs package.json pnpm-lock.yaml
git commit -m "chore: add shared flat ESLint config"
```

---

## Task 14: CI workflow (GitHub Actions)

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: decathlon
          POSTGRES_PASSWORD: decathlon
          POSTGRES_DB: decathlon
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    env:
      DB_HOST: localhost
      DB_PORT: 5432
      DB_USER: decathlon
      DB_PASSWORD: decathlon
      DB_NAME: decathlon
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
```

- [ ] **Step 2: Validate the workflow YAML locally**

Run: `node -e "require('fs').readFileSync('.github/workflows/ci.yml','utf8')"` (confirms the file exists/readable)
Run (if available): `npx --yes yaml-lint .github/workflows/ci.yml`
Expected: no syntax errors. (CI itself runs on push/PR once the repo has a remote.)

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add install/lint/test/build pipeline"
```

---

## Task 15: README + final full-stack verification

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create `README.md`**

```markdown
# Decathlon Clone

A full-stack e-commerce application (React + NestJS) replicating the core
features and flows of decathlon.bg. Portfolio project — synthetic data,
Stripe test mode.

## Stack
- Monorepo: pnpm workspaces (`apps/web`, `apps/api`, `packages/shared`)
- Backend: NestJS + TypeORM + PostgreSQL
- Frontend: React + Vite + Tailwind + React Router + TanStack Query + i18next
- Tests: Jest/Supertest (api), Vitest/Testing Library (web)

## Prerequisites
- Node 20+, pnpm 9+, Docker

## Setup
\`\`\`bash
pnpm install
cp .env.example apps/api/.env   # adjust if needed
docker compose up -d            # start PostgreSQL
\`\`\`

## Run (dev)
\`\`\`bash
# terminal A
pnpm --filter @decathlon/api dev     # http://localhost:3000/api
# terminal B
pnpm --filter @decathlon/web dev     # http://localhost:5173
\`\`\`

Visit http://localhost:5173/health — it should show \`api: ok\`.

## Common scripts
- \`pnpm lint\` — lint all packages
- \`pnpm test\` — run all tests
- \`pnpm build\` — build all packages
- \`pnpm --filter @decathlon/api migration:run\` — run DB migrations

## Project docs
- Master design: \`docs/superpowers/specs/2026-06-08-decathlon-clone-design.md\`
- Phase plans: \`docs/superpowers/plans/\`
```

- [ ] **Step 2: Run the complete verification suite from a clean install**

Run:
```bash
pnpm install
pnpm lint
pnpm test
pnpm build
```
Expected: all four succeed with no errors. `pnpm test` runs shared + api (unit) + web tests.

- [ ] **Step 3: Run the API e2e tests**

Run: `pnpm --filter @decathlon/api test:e2e`
Expected: PASS.

- [ ] **Step 4: Final manual smoke test (full stack)**

Run: `docker compose up -d`
Terminal A: `pnpm --filter @decathlon/api dev`
Terminal B: `pnpm --filter @decathlon/web dev`
Open `http://localhost:5173/health`.
Expected: renders `api: ok`. Toggle the BG/EN switcher in the header and confirm it responds. Stop servers afterward.

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: add project README and setup instructions"
```

---

## Self-Review Notes (completed by plan author)

- **Spec coverage (Phase 0 row + §8 of the master spec):** monorepo (Task 1), shared package (Task 2), NestJS+TypeORM skeleton + migrations setup (Tasks 3, 6), global validation pipe + exception filter + health endpoint (Tasks 3–5), React+Vite+Tailwind+router+i18n shell + design-system primitive (Tasks 7–11), Docker Postgres + `.env.example` (Task 6), ESLint+Prettier + shared tsconfig + EditorConfig (Tasks 1, 13), CI (Task 14), README (Task 15). All Phase 0 items mapped.
- **Deferred to later phases (correctly out of Phase 0 scope):** real entities/migrations with tables (Phase 1), full design system + layout fidelity (Phase 2). The `seed framework` from the master spec is intentionally deferred to Phase 1, where the first entities exist to seed — noted here so it is not lost.
- **Placeholder scan:** no TBD/TODO; every code step shows complete code; every run step shows the command and expected result.
- **Type consistency:** `HealthStatus`/`makeHealthStatus` defined in Task 2 and consumed unchanged in Tasks 5 and 12; `Button` props/exports consistent; `dataSourceOptions` defined in Task 6 and imported in `app.module.ts` same task.
```
