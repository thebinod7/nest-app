import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { SignupDto } from 'src/auth/dto';
import { CreatePermissionDto } from 'src/roles/dto';

const PORT = 4000;
const APP_URL = `http://localhost:${PORT}`;

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
		await app.listen(PORT);

		prisma = app.get(PrismaService);
		// await prisma.cleanDb();
		pactum.request.setBaseUrl(APP_URL);
		pactum.request.setDefaultTimeout(5000);
	});

	afterAll(() => app.close());

	describe('RS-User', () => {
		const userDto: SignupDto = {
			firstName: 'John',
			lastName: 'Doe',
			roleId: 3,
			authAddress: 'go@mailinator.com',
			authType: 'Email',
		};

		const permissionDto: CreatePermissionDto = {
			action: 'test',
			subject: 'user',
			roleId: 3,
		};
		// =========Admin Test Cases============
		describe.only('Admin test cases:', () => {
			const email = 'admin@mailinator.com';
			it('Should SEND OTP', () => {
				return pactum
					.spec()
					.post('/auth/otp')
					.withBody({ authAddress: email })
					.expectStatus(200)
					.stores('currentOTP', 'otp');
			});

			it('Should LOGIN using OTP', () => {
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

			it('Should CREATE Role', () => {
				return pactum
					.spec()
					.post('/roles')
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.withBody({
						name: genRandomString(),
						isSystem: false,
					})
					.expectStatus(200)
					.stores('createdRole', 'id');
			});

			it('Should UPDATE Role', () => {
				const createdRole = `$S{createdRole}`;
				return pactum
					.spec()
					.patch('/roles/' + createdRole)
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.withBody({
						name: genRandomString(),
						isSystem: false,
					})
					.expectStatus(200);
			});

			it('Should DELETE Role', () => {
				const createdRole = `$S{createdRole}`;
				return pactum
					.spec()
					.delete('/roles/' + createdRole)
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.expectStatus(200);
			});

			it('Should CREATE User', () => {
				const emailPrefix = genRandomString(5);
				userDto.authAddress = `${emailPrefix}@mailinator.com`;
				return pactum
					.spec()
					.post('/users')
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.withBody(userDto)
					.expectStatus(200)
					.stores('createdUser', 'id');
			});

			it('Should DELETE User', () => {
				const createdUser = `$S{createdUser}`;
				return pactum
					.spec()
					.delete('/users/' + createdUser)
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.expectStatus(200);
			});

			it('Should CREATE permission', () => {
				return pactum
					.spec()
					.post('/roles/perm')
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.withBody({ action: 'update', subject: 'all', roleId: 3 })
					.expectStatus(200)
					.stores('createdPermId', 'id');
			});

			it('Should DELETE Permission', () => {
				const createdPermId = `$S{createdPermId}`;
				return pactum
					.spec()
					.delete(`/roles/${createdPermId}/perms`)
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.expectStatus(200);
			});

			it('Should NOT DELETE System Role', () => {
				const roleId = 1;
				return pactum
					.spec()
					.delete(`/roles/${roleId}`)
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.expectStatus(401);
			});
		});

		// =========Manager Test Cases============
		describe('Manager test cases:', () => {
			const email = 'manager@mailinator.com';
			it('Should SEND OTP', () => {
				return pactum
					.spec()
					.post('/auth/otp')
					.withBody({ authAddress: email })
					.expectStatus(200)
					.stores('currentOTP', 'otp');
			});

			it('Should LOGIN using OTP', () => {
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

			it('Should CREATE Role', () => {
				return pactum
					.spec()
					.post('/roles')
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.withBody({
						name: genRandomString(),
						isSystem: false,
					})
					.expectStatus(200)
					.stores('createdRole', 'id');
			});

			it('Should UPDATE Role', () => {
				const createdRole = `$S{createdRole}`;
				return pactum
					.spec()
					.patch('/roles/' + createdRole)
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.withBody({
						name: genRandomString(),
						isSystem: false,
					})
					.expectStatus(200);
			});

			it('Should NOT DELETE Role', () => {
				const createdRole = `$S{createdRole}`;
				return pactum
					.spec()
					.delete('/roles/' + createdRole)
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.expectStatus(401);
			});

			it('Should CREATE User', () => {
				const emailPrefix = genRandomString(5);
				const dto: SignupDto = {
					roleId: 3,
					firstName: genRandomString(),
					lastName: genRandomString(),
					authAddress: `${emailPrefix}@mailinator.com`,
					authType: 'Email',
				};
				return pactum
					.spec()
					.post('/users')
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.withBody(dto)
					.expectStatus(200)
					.stores('createdUser', 'id');
			});

			it('Should UPDATE User', () => {
				const createdUser = `$S{createdUser}`;
				return pactum
					.spec()
					.patch('/users/' + createdUser)
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.withBody({
						firstName: 'Joe',
					})
					.expectStatus(200);
			});

			it('Should NOT DELETE User', () => {
				const createdUser = `$S{createdUser}`;
				return pactum
					.spec()
					.delete('/users/' + createdUser)
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.expectStatus(401);
			});

			it('Should CREATE permission', () => {
				return pactum
					.spec()
					.post('/roles/perm')
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.withBody(permissionDto)
					.expectStatus(200)
					.stores('createdPermId', 'id');
			});

			it('Should UPDATE Permission', () => {
				const createdPermId = `$S{createdPermId}`;
				return pactum
					.spec()
					.patch(`/roles/${createdPermId}/perms`)
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.withBody({
						action: 'update',
					})
					.expectStatus(200)
					.inspect();
			});

			it('Should DELETE Permission', () => {
				const createdPermId = `$S{createdPermId}`;
				return pactum
					.spec()
					.delete(`/roles/${createdPermId}/perms`)
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.expectStatus(401);
			});
		});

		// ===========User Test Cases===============
		describe('User test cases', () => {
			const email = 'user@mailinator.com';
			it('Should SEND OTP', () => {
				return pactum
					.spec()
					.post('/auth/otp')
					.withBody({ authAddress: email })
					.expectStatus(200)
					.stores('currentOTP', 'otp');
			});

			it('Should LOGIN using OTP', () => {
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

			it('Should LIST Users', () => {
				return pactum
					.spec()
					.get('/users')
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.expectStatus(200);
			});

			it('Should UPDATE Profile', () => {
				return pactum
					.spec()
					.patch('/users/profile')
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.withBody({
						firstName: 'Tony',
						lastName: 'Stark',
					})
					.expectStatus(200);
			});

			it('Should NOT LIST Roles', () => {
				return pactum
					.spec()
					.get('/roles')
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.expectStatus(401);
			});

			it('Should NOT LIST Permissions', () => {
				return pactum
					.spec()
					.get('/roles/perms')
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.expectStatus(401);
			});

			it('Should NOT CREATE User', () => {
				return pactum
					.spec()
					.post('/users')
					.withBody(userDto)
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.expectStatus(401);
			});

			it('Should NOT DELETE User', () => {
				const userId = 3;
				return pactum
					.spec()
					.delete(`/users/${userId}`)
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.expectStatus(401);
			});

			it('Should NOT CREATE Role', () => {
				return pactum
					.spec()
					.post('/roles')
					.withBody({ name: 'Test' })
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.expectStatus(401);
			});

			it('Should NOT DELETE Role', () => {
				const roleId = 3;
				return pactum
					.spec()
					.delete(`/roles/${roleId}`)
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.expectStatus(401);
			});

			it('Should NOT CREATE Permission', () => {
				return pactum
					.spec()
					.post('/roles/perm')
					.withBody(permissionDto)
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.expectStatus(401);
			});

			it('Should NOT DELETE Permission', () => {
				const permId = 3;
				return pactum
					.spec()
					.delete(`/roles/${permId}/perms`)
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.expectStatus(401);
			});
		});
	});
});

function genRandomString(length: number = 8) {
	let result = '';
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}
