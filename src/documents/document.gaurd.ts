import { Injectable, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class DocumentAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    
    if (!request.headers.authorization) {
      throw new UnauthorizedException('No token provided');
    }

    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const request = context.switchToHttp().getRequest();
    const { method, route } = request;

    // Document Management Permissions
    if (route.path.startsWith('/documents')) {
      if (method === 'POST' || method === 'PUT') {
        // Only Admins & Editors can create/update
        if (user.role !== 'admin' && user.role !== 'editor') {
          throw new ForbiddenException('Access denied. Editors and Admins only.');
        }
      } else if (method === 'DELETE') {
        // Only Admins can delete
        if (user.role !== 'admin') {
          throw new ForbiddenException('Access denied. Admins only.');
        }
      } else if (method === 'GET') {
        // All roles (Admin, Editor, Viewer) can view documents
        return user;
      }
    }

    return user;
  }
}
