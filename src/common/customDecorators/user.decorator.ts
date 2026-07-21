import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IHUser } from 'src/model';
import { IAuthReq } from '../interfaces';





export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
        let user!:IHUser
        switch (context.getType()) {
          case "http":
            user = (context.switchToHttp().getRequest() as IAuthReq).credentials.user
            
            break;
        
          default:
            break;
        }

        return user     
  },
);