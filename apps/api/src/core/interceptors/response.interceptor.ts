import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface WrappedResponse<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, WrappedResponse<T> | T>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<WrappedResponse<T> | T> {
    return next.handle().pipe(
      map((data) => {
        const res = context.switchToHttp().getResponse<Response>();
        if (res.statusCode === 204) {
          return data as T;
        }
        return { data };
      }),
    );
  }
}
