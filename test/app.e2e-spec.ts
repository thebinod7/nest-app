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
		const r = await prisma.role.findMany();
		console.log('====>', r);
		// await prisma.cleanDb();
		pactum.request.setBaseUrl(APP_URL);
		pactum.request.setDefaultTimeout(5000);
	});

	afterAll(() => app.close());

	describe('Auth', () => {
		describe('Admin test cases', () => {
			const email = 'admin@mailinator.com';
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
					.withBody({ authAddress: email })
					.expectStatus(200)
					.stores('currentOTP', 'otp');
			});

			it('Should login using OTP', () => {
				const otp = `$S{currentOTP}`;
				return pactum
					.spec()
					.post('/auth/login')
					.withBody({
						authAddress: email,
						otp: otp,
					})
					.expectStatus(200)
					.stores('userToken', 'accessToken');
			});

			it('Should create a role', () => {
				return pactum
					.spec()
					.post('/roles')
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.withBody({
						name: 'Demo101',
						isSystem: false,
					})
					.expectStatus(200)
					.stores('roleId', 'id');
			});

			it('Should update a role', () => {
				const roleId = `$S{roleId}`;
				return pactum
					.spec()
					.patch('/roles/' + roleId)
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.withBody({
						name: 'Demo102',
						isSystem: false,
					})
					.expectStatus(200)
					.inspect();
			});

			it('Should delete a role', () => {
				const roleId = `$S{roleId}`;
				return pactum
					.spec()
					.delete('/roles/' + roleId)
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.expectStatus(200);
			});
		});
	});
});
