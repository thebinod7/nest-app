import { Injectable } from '@nestjs/common';
import { User, Bookmark } from '@prisma/client';

@Injectable({})
export class AuthService {
  login() {
    return 'Hello gotcha!';
  }

  singup() {}
}
