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

		pactum.request.setBaseUrl(APP_URL);
	});

	afterAll(() => app.close());

	describe('Auth', () => {
		const dto: SignupDto = {
			authAddress: 'bruce@mail.com',
			authType: 'Email',
			firstName: 'Bruce',
			lastName: 'Wayne',
			roleId: 2,
		};
		// describe.only('Should Signup', () => {
		// 	it('Should throw if auth address', () => {
		// 		return pactum
		// 			.spec()
		// 			.post('/auth/signup')
		// 			.withBody({ authType: dto.authType })
		// 			.expectStatus(400);
		// 	});

		// 	it('Should signup', () => {
		// 		return pactum
		// 			.spec()
		// 			.post('/auth/signup')
		// 			.withBody(dto)
		// 			.expectStatus(201)
		// 			.inspect();
		// 	});
		// });

		// describe('Login', () => {
		// 	it('Should throw if empty email', () => {
		// 		return pactum
		// 			.spec()
		// 			.post('/auth/login')
		// 			.withBody({ authAddress: dto.authAddress })
		// 			.expectStatus(400);
		// 	});

		// 	it('Should login', () => {
		// 		return pactum
		// 			.spec()
		// 			.post('/auth/login')
		// 			.withBody(dto)
		// 			.expectStatus(200)
		// 			.stores('userToken', 'access_token');
		// 	});
		// });
	});

	describe('User', () => {
		describe.only('Get Me', () => {
			it('Should get current user', () => {
				return pactum
					.spec()
					.get('/users/me')
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.expectStatus(200);
			});
		});
		describe('Edit User', () => {
			const editUserDto = {
				firstName: 'Vlad',
				email: 'vlad@mail.com',
			};
			it('Should update user', () => {
				return pactum
					.spec()
					.patch('/users')
					.withHeaders({ Authorization: `Bearer $S{userToken}` })
					.withBody(editUserDto)
					.expectStatus(200)
					.expectBodyContains(editUserDto.email)
					.expectBodyContains(editUserDto.firstName);
			});
		});
	});
	// ===============================

	describe('Get bookmarks', () => {
		it('should get bookmarks', () => {
			return pactum
				.spec()
				.get('/bookmarks')
				.withHeaders({
					Authorization: 'Bearer $S{userToken}',
				})
				.expectStatus(200)
				.expectJsonLength(1);
		});
	});

	describe('Get bookmark by id', () => {
		it('should get bookmark by id', () => {
			return pactum
				.spec()
				.get('/bookmarks/{id}')
				.withPathParams('id', '$S{bookmarkId}')
				.withHeaders({
					Authorization: 'Bearer $S{userToken}',
				})
				.expectStatus(200)
				.expectBodyContains('$S{bookmarkId}');
		});
	});

	describe('Edit bookmark by id', () => {
		const dto: any = {
			title:
				'Kubernetes Course - Full Beginners Tutorial (Containerize Your Apps!)',
			description:
				'Learn how to use Kubernetes in this complete course. Kubernetes makes it possible to containerize applications and simplifies app deployment to production.',
		};
		it('should edit bookmark', () => {
			return pactum
				.spec()
				.patch('/bookmarks/{id}')
				.withPathParams('id', '$S{bookmarkId}')
				.withHeaders({
					Authorization: 'Bearer $S{userToken}',
				})
				.withBody(dto)
				.expectStatus(200)
				.expectBodyContains(dto.title)
				.expectBodyContains(dto.description);
		});
	});

	describe('Delete bookmark by id', () => {
		it('should delete bookmark', () => {
			return pactum
				.spec()
				.delete('/bookmarks/{id}')
				.withPathParams('id', '$S{bookmarkId}')
				.withHeaders({
					Authorization: 'Bearer $S{userToken}',
				})
				.expectStatus(204);
		});

		it('should get empty bookmarks', () => {
			return pactum
				.spec()
				.get('/bookmarks')
				.withHeaders({
					Authorization: 'Bearer $S{userToken}',
				})
				.expectStatus(200)
				.expectJsonLength(0);
		});
	});
});
