import { AuthGuard } from '@nestjs/passport';
import { JWT_TYPE } from '../../shared/constants';

export class JwtGuard extends AuthGuard(JWT_TYPE) {
  constructor() {
    super();
  }
}
