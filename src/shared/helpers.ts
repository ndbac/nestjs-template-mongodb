import _ from 'lodash';
import { forOwnRecursive } from './mongoose/helpers';
import { Request } from 'express';

export const convertErrorToLogData = (err: any) => ({
  err,
  errStack: err?.stack,
  errStr: String(err),
});

export const mask = (text: string, keep = 0) => {
  const regex = new RegExp(`\\S(?=.{${keep}})`, 'g');
  return text.toString().replace(regex, '*');
};

export const maskFieldsInObject = (data: any, fieldsToMask: string[]) => {
  const clonedData = _.cloneDeep(data);
  if (_.isEmpty(fieldsToMask)) {
    return;
  }

  forOwnRecursive(clonedData, (value, paths) => {
    const field = _.last(paths);
    if (field && fieldsToMask.includes(field)) {
      _.set(clonedData, paths.join('.'), mask(value || ''));
    }
  });

  return clonedData;
};

export const regExpEscape = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const executeSubsequentPromises = (
  promises: (() => Promise<void>)[],
) => {
  return promises.reduce((aggPromise, curPromise) => {
    return aggPromise.then(() => curPromise());
  }, Promise.resolve());
};

export const getBearerTokenFromRequest = (req: Request) => {
  if (!req.headers) {
    return undefined;
  }

  const authHeader =
    req.headers['authorization'] || req.headers['proxy-authorization'];

  if (authHeader) {
    const tokens = authHeader.split(' ');
    return tokens[0] === 'Bearer' ? tokens[1] : undefined;
  }
  return undefined;
};
