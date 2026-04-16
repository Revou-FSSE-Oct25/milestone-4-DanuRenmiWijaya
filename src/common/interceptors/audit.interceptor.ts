import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, body, ip } = request;

    return next.handle().pipe(
      tap(async (responseData) => {
        if (['POST', 'PATCH', 'DELETE'].includes(method)) {
          await this.prisma.auditLog.create({
            data: {
              userId: user?.userId || 'SYSTEM',
              action: `${method} ${url}`,
              entity: url.split('/')[1],
              newData: body,
              ipAddress: ip,
            },
          });
        }
      }),
    );
  }
}
