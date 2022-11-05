import { winstonLogger } from './winston.logger';
import { isAxiosError, isHttpException } from 'src/errors/errors';
import { convertErrorToLogData } from '../helpers';
import * as _ from 'lodash';

export const infoLog = (data: any, message?: string) => {
  winstonLogger.info(message || '', { data });
};

export const errorLog = (err: any, context?: any, message?: string) => {
  let data = {};
  if (isHttpException(err)) {
    data = { response: err.getResponse(), statusCode: err.getStatus() };
  }
  if (isAxiosError(err)) {
    data = { body: err.response?.data, statusCode: err.response?.status };
  }
  if (_.isEmpty(data)) {
    data = convertErrorToLogData(err);
  }
  winstonLogger.error(message || '', { data: { err: data, context } });
};
