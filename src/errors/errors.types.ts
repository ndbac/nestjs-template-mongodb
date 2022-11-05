import { HttpStatus } from '@nestjs/common';

export interface IGeneralErrorShape {
  message: string;
  description?: string;
  errorCode: string;
  statusCode?: HttpStatus;
  logData?: any;
  errStack?: any;
}
