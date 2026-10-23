import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { AdminRole } from '../../common/enums/admin-role.enum';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (request.user?.role !== AdminRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only a super administrator can create administrator accounts.');
    }
    return true;
  }
}
