import { BadRequestException } from '@nestjs/common';
import { DEFAULT_PAGINATION } from 'src/shared/constants';
import {
  createPagination,
  getPaginationHeaders,
} from 'src/shared/pagination.helpers';

describe('pagination.helper', () => {
  describe('PaginationHeaderHelper', () => {
    describe('getHeaders', () => {
      it('should return correct result', () => {
        const res = getPaginationHeaders(
          {
            page: 1,
            pageSize: 2,
          },
          3,
        );
        expect(res).toEqual({
          'x-pagination-page': 1,
          'x-pagination-page-size': 2,
          'x-pagination-total': 3,
        });
      });

      it('correct result with end-of-page', () => {
        const res = getPaginationHeaders(
          {
            page: 3,
            pageSize: 2,
          },
          5,
        );
        expect(res).toEqual({
          'x-pagination-page': 3,
          'x-pagination-page-size': 2,
          'x-pagination-total': 5,
        });
      });

      it('should return undefined if not pass pagination', () => {
        const res = getPaginationHeaders(null, 0);
        expect(res).toEqual(getPaginationHeaders(DEFAULT_PAGINATION, 0));
      });
    });
  });

  describe('createPagination', () => {
    it('should return correct result', () => {
      const res = createPagination(1, 2);
      expect(res).toEqual({
        page: 1,
        pageSize: 2,
        offset: 0,
      });
    });
    it('should throw error', () => {
      try {
        createPagination(0, 2);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
      }
      try {
        createPagination(1, -2);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
      }
      try {
        createPagination(NaN, 2);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
      }
      try {
        createPagination(2, Infinity);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
