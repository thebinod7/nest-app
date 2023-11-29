import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { SignupDto } from 'src/auth/dto';

const APP_URL = 'http://localhost:3333';

describe('App e2e', () => {
	let app: INestApplication;
	let prisma: PrismaService;
	beforeAll(async () => {
		const moduleRef = Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = (await moduleRef).createNestApplication();
		app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
		await app.init();
		await app.listen(3333);

		prisma = app.get(PrismaService);
		await prisma.cleanDb();
		await prisma.role.create({
			data: {
				id: 1,
				name: 'Manager',
			},
		});
		await prisma.role.create({
			data: {
				id: 2,
				name: 'Admin',
				isSystem: true,
			},
		});

		pactum.request.setBaseUrl(APP_URL);
		pactum.request.setDefaultTimeout(5000);
	});

	afterAll(() => app.close());

	describe('Auth', () => {
		const dto: SignupDto = {
			authAddress: 'bruce@mailinator.com',
			authType: 'Email',
			firstName: 'Bruce',
			lastName: 'Wayne',
			roleId: 2,
		};
		describe('Should Signup', () => {
			it('Should throw if no auth address', () => {
				return pactum
					.spec()
					.post('/auth/signup')
					.withBody({ authType: dto.authType })
					.expectStatus(400);
			});

			it('Should signup with email', () => {
				return pactum
					.spec()
					.post('/auth/signup')
					.withBody(dto)
					.expectStatus(200);
			});
		});

		describe('Login', () => {
			it('Should throw if empty auth address', () => {
				return pactum
					.spec()
					.post('/auth/login')
					.withBody({ authType: 'Email' })
					.expectStatus(400);
			});

			it('Should send OTP', () => {
				return pactum
					.spec()
					.post('/auth/otp')
					.withBody({ authAddress: dto.authAddress })
					.expectStatus(200)
					.stores('currentOTP', 'otp');
			});

			it('Should login using OTP', () => {
				const otp = `$S{currentOTP}`;
				return pactum
					.spec()
					.post('/auth/login')
					.withBody({
						authAddress: dto.authAddress,
						otp: otp,
					})
					.expectStatus(200)
					.stores('userToken', 'accessToken');
			});
		});
	});
});
