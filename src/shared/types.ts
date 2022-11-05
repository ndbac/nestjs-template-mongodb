import {
  ApiBodyOptions,
  ApiParamOptions,
  ApiQueryOptions,
  ApiResponseOptions,
} from '@nestjs/swagger';

export enum IamNamespace {
  BLOG_ADMINS = 'blog-admins',
  BLOG_WRITERS = 'blog-writers',
  BLOG_READERS = 'blog-readers',
}

export enum CollectionName {
  SAMPLES = 'samples',
}

export interface IPagination {
  page: number;
  pageSize: number;
  offset: number;
}

export interface IPaginationHeader {
  'x-pagination-page': number;
  'x-pagination-page-size': number;
  'x-pagination-total': number;
}

export interface IPaginationResponse<T> {
  items: T[];
  headers: IPaginationHeader;
}

export interface IPaginationOptions {
  maxLimit?: number;
}

export interface IEndpointConfiguration {
  operationId: string;
  description?: string;
  deprecated?: boolean;
  summary?: string;
  params?: ApiParamOptions[];
  body?: ApiBodyOptions;
  query?: ApiQueryOptions[];
  contentTypes?: string[];
  responses?: ApiResponseOptions[];
}

export interface IRequestWithUserCtx extends Request {
  user: IIamUserData;
}

export enum UserIdentifierType {
  PHONE_NUMBER = 'phone_number',
  EMAIL = 'email',
}

export interface IIamUserData {
  namespace: IamNamespace;
  userId: string;
  identifier: string;
  identifierType: UserIdentifierType;
}

export type Emptyable<T> = T | undefined | null;
export type NonEmptyable<T> = Exclude<T, undefined | null>;
export type MakeEmptyable<From, To> = null extends From
  ? undefined extends From
    ? To | null | undefined
    : To | null
  : To;
