import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
	constructor(config: ConfigService) {
		// Calls constructor of parent class
		super({
			datasources: {
				db: {
					url: config.get('DATABASE_URL'),
				},
			},
		});
	}

	async cleanDb() {
		// return this.$transaction([
		// 	this.user.deleteMany(),
		// 	this.role.deleteMany(),
		// 	this.permission.deleteMany(),
		// ]);
	}
}
