import { NotFoundException } from '@nestjs/common';
import { BaseRepository } from '../../src/shared/mongoose/base.repository';

describe('BaseRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  const mockObjectId = '62298e97b1a2a6001220201e';

  describe('aggregate', () => {
    it('should ok', async () => {
      const repo = new BaseRepository({
        aggregate: jest.fn().mockReturnValue({ exec: jest.fn() }),
      } as any);

      const aggregations = [];
      await repo.aggregate(aggregations);

      expect(repo.model.aggregate).toBeCalledWith(aggregations);
    });
  });

  describe('count', () => {
    it('should ok', async () => {
      const repo = new BaseRepository({
        countDocuments: jest.fn().mockReturnValue({
          exec: jest.fn(),
          maxTimeMS: () => ({ exec: jest.fn() }),
        }),
      } as any);

      const conditions = {};
      await repo.count(conditions);

      expect(repo.model.countDocuments).toBeCalledWith(conditions);
    });
  });

  describe('create', () => {
    it('should ok for one record', async () => {
      const repo = new BaseRepository(jest.fn(() => ({})) as any);
      jest.spyOn(repo, 'save').mockImplementation(jest.fn());

      await repo.create({});

      expect(repo.save).toBeCalledWith({}, undefined);
      expect(repo.save).toBeCalledTimes(1);
    });

    it('should ok for multi records', async () => {
      const repo = new BaseRepository(jest.fn(() => ({})) as any);
      jest.spyOn(repo, 'save').mockImplementation(jest.fn());

      await repo.create([{}, {}, {}]);

      expect(repo.save).nthCalledWith(1, {}, undefined);
      expect(repo.save).nthCalledWith(2, {}, undefined);
      expect(repo.save).nthCalledWith(3, {}, undefined);
    });
  });

  describe('delete', () => {
    it('should ok for one record', async () => {
      const repo = new BaseRepository(jest.fn(() => ({})) as any);

      const docRemoveFn = jest.fn();
      const sessionFn = jest.fn();
      const sessionOption = jest.fn() as any;
      await repo.delete({ remove: docRemoveFn, $session: sessionFn } as any, {
        session: sessionOption,
      });

      expect(docRemoveFn).toBeCalledWith();
      expect(docRemoveFn).toBeCalledTimes(1);
      expect(sessionFn).toBeCalledWith(sessionOption);
      expect(sessionFn).toBeCalledTimes(1);
    });

    it('should ok for multi records', async () => {
      const repo = new BaseRepository(jest.fn(() => ({})) as any);

      const docRemoveFn = jest.fn();
      const sessionFn = jest.fn();
      const sessionOption = jest.fn() as any;
      await repo.delete(
        [
          { remove: docRemoveFn, $session: sessionFn } as any,
          { remove: docRemoveFn, $session: sessionFn } as any,
          { remove: docRemoveFn, $session: sessionFn } as any,
        ],
        { session: sessionOption },
      );

      expect(docRemoveFn).nthCalledWith(1);
      expect(sessionFn).nthCalledWith(1, sessionOption);
      expect(docRemoveFn).nthCalledWith(2);
      expect(sessionFn).nthCalledWith(2, sessionOption);
      expect(docRemoveFn).nthCalledWith(3);
      expect(sessionFn).nthCalledWith(3, sessionOption);
    });
  });

  describe('deleteById', () => {
    it('should ok', async () => {
      const repo = new BaseRepository({} as any);
      jest.spyOn(repo, 'deleteOne').mockImplementation(jest.fn());

      await repo.deleteById(mockObjectId);

      expect(repo.deleteOne).toBeCalledWith({ _id: mockObjectId }, undefined);
    });
  });

  describe('deleteMany', () => {
    it('should ok', async () => {
      const execFn = jest.fn().mockReturnValue({});
      const sessionFn = jest.fn().mockReturnValue({ exec: execFn });
      const repo = new BaseRepository({
        deleteMany: jest.fn().mockReturnValue({
          session: sessionFn,
          exec: execFn,
        }),
      } as any);

      const deleteConditions = { condition: 1 };
      const sessionOptions = {};
      const deleteOptions = { session: sessionOptions } as any;
      await repo.deleteMany(deleteConditions, deleteOptions);

      expect(sessionFn).toBeCalledWith(sessionOptions);
      expect(repo.model.deleteMany).toBeCalledWith(deleteConditions);
    });
  });

  describe('deleteOne', () => {
    it('should ok', async () => {
      const findOneAndDeleteFn = jest.fn().mockReturnValue({ exec: jest.fn() });
      const repo = new BaseRepository({
        findOneAndDelete: findOneAndDeleteFn,
      } as any);

      await repo.deleteOne('id' as any);

      expect(findOneAndDeleteFn).toBeCalledWith('id', undefined);
    });
  });

  describe('exists', () => {
    it('should ok', async () => {
      const countDocuments = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(1) });
      const repo = new BaseRepository({ countDocuments } as any);

      await repo.exists({});

      expect(countDocuments).toBeCalled();
    });
  });

  describe('existsById', () => {
    it('should ok', async () => {
      const countDocuments = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(1) });
      const repo = new BaseRepository({ countDocuments } as any);

      await repo.existsById(mockObjectId);

      expect(countDocuments).toBeCalled();
    });
  });

  describe('find', () => {
    it('should ok', async () => {
      const find = jest.fn().mockReturnValue({
        exec: jest.fn(),
        maxTimeMS: () => ({ exec: jest.fn() }),
      });
      const repo = new BaseRepository({ find } as any);

      await repo.find('' as any);

      expect(find).toBeCalled();
    });
  });

  describe('findById', () => {
    it('should ok', async () => {
      const repo = new BaseRepository({} as any);
      repo.findOne = jest.fn();
      await repo.findById(mockObjectId);

      expect(repo.findOne).toBeCalled();
    });
  });

  describe('findOne', () => {
    it('should ok', async () => {
      const findOne = jest.fn().mockReturnValue({
        exec: jest.fn(),
        maxTimeMS: () => ({ exec: jest.fn() }),
      });
      const repo = new BaseRepository({ findOne } as any);

      await repo.findOne('' as any);

      expect(findOne).toBeCalled();
    });
  });

  describe('findOneOrCreate', () => {
    it('should call create if document not existed', async () => {
      const repo = new BaseRepository({} as any);
      repo.findOne = jest.fn().mockResolvedValue(null);
      repo.create = jest.fn();

      await repo.findOneOrCreate({}, {});

      expect(repo.create).toBeCalled();
    });

    it('should not call create if document existed', async () => {
      const repo = new BaseRepository({} as any);
      repo.findOne = jest.fn().mockResolvedValue({});
      repo.create = jest.fn();

      await repo.findOneOrCreate({}, {});

      expect(repo.create).not.toBeCalled();
    });
  });

  describe('save', () => {
    it('should call docs.save one time', async () => {
      const repo = new BaseRepository({} as any);
      const doc = { save: jest.fn() } as any;

      await repo.save(doc);

      expect(doc.save).toBeCalledTimes(1);
    });

    it('should call docs.save two times', async () => {
      const repo = new BaseRepository({} as any);
      const doc = { save: jest.fn() } as any;

      await repo.save([doc, doc]);

      expect(doc.save).toBeCalledTimes(2);
    });
  });

  describe('update', () => {
    it('should ok', async () => {
      const update = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ ok: false }),
        maxTimeMS: () => ({ exec: jest.fn().mockResolvedValue({ ok: false }) }),
      });
      const repo = new BaseRepository({ updateOne: update } as any);

      const res = await repo.update({}, {});

      expect(update).toBeCalled();
      expect(res).toEqual(0);
    });

    it('should ok', async () => {
      const modifiedCount = 1;
      const update = jest.fn().mockReturnValue({
        exec: jest
          .fn()
          .mockResolvedValue({ acknowledged: true, modifiedCount }),
        maxTimeMS: () => ({
          exec: jest
            .fn()
            .mockResolvedValue({ acknowledged: true, modifiedCount }),
        }),
      });
      const repo = new BaseRepository({ updateOne: update } as any);

      const res = await repo.update({}, {});

      expect(update).toBeCalled();
      expect(res).toEqual(modifiedCount);
    });
  });

  describe('updateById', () => {
    it('should ok', async () => {
      const repo = new BaseRepository({} as any);
      repo.updateOne = jest.fn();
      await repo.updateById(mockObjectId, {});

      expect(repo.updateOne).toBeCalled();
    });
  });

  describe('updateMany', () => {
    it('should ok', async () => {
      const updateMany = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ acknowledged: false }),
        maxTimeMS: () => ({ exec: jest.fn().mockResolvedValue({ ok: false }) }),
      });
      const repo = new BaseRepository({ updateMany } as any);

      const res = await repo.updateMany({}, {});

      expect(updateMany).toBeCalled();
      expect(res).toEqual(0);
    });

    it('should ok', async () => {
      const modifiedCount = 1;
      const updateMany = jest.fn().mockReturnValue({
        exec: jest
          .fn()
          .mockResolvedValue({ acknowledged: true, modifiedCount }),
        maxTimeMS: () => ({
          exec: jest
            .fn()
            .mockResolvedValue({ acknowledged: true, modifiedCount }),
        }),
      });
      const repo = new BaseRepository({ updateMany } as any);

      const res = await repo.updateMany({}, {});

      expect(updateMany).toBeCalled();
      expect(res).toEqual(modifiedCount);
    });
  });

  describe('updateOne', () => {
    it('should ok', async () => {
      const findOneAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn(),
        maxTimeMS: () => ({ exec: jest.fn() }),
      });
      const repo = new BaseRepository({ findOneAndUpdate } as any);

      await repo.updateOne({}, {});

      expect(findOneAndUpdate).toBeCalled();
    });
  });

  describe('updateOneOrCreate', () => {
    it('should ok', async () => {
      const repo = new BaseRepository({} as any);
      repo.updateOne = jest.fn();
      await repo.updateOneOrCreate({}, {});

      expect(repo.updateOne).toBeCalled();
    });
  });

  describe('withTransaction', () => {
    it('should call endSession', async () => {
      const session = {
        endSession: jest.fn(),
        withTransaction: jest.fn().mockImplementation((fn) => fn()),
      };
      const repo = new BaseRepository({
        db: { startSession: () => session },
      } as any);

      await repo.withTransaction(() => Promise.resolve(true));

      expect(session.endSession).toBeCalled();
    });

    it('should call endSession', async () => {
      const session = {
        endSession: jest.fn(),
        withTransaction: jest.fn().mockImplementation((fn) => fn()),
      };
      const repo = new BaseRepository({
        db: { startSession: () => session },
      } as any);

      try {
        await repo.withTransaction(() => Promise.reject(true));
      } catch (e) {
        console.log(e);
      }

      expect(session.endSession).toBeCalled();
    });
  });

  describe('getCollectionName', () => {
    it('should ok', () => {
      const collection = { collectionName: '' };
      const repo = new BaseRepository({ collection } as any);

      repo.getCollectionName();
    });
  });

  describe('createCollection', () => {
    it('should not call createCollection', async () => {
      const createCollection = jest.fn().mockReturnValue({
        exec: jest.fn(),
        maxTimeMS: () => ({ exec: jest.fn() }),
      });
      const db = {
        db: {
          listCollections: () => ({
            next: () => true,
          }),
        },
      };
      const collection = { collectionName: '' };

      const repo = new BaseRepository({
        createCollection,
        db,
        collection,
      } as any);

      await repo.createCollection();

      expect(createCollection).not.toBeCalled();
    });

    it('should call createCollection', async () => {
      const createCollection = jest.fn().mockReturnValue({
        exec: jest.fn(),
        maxTimeMS: () => ({ exec: jest.fn() }),
      });
      const db = {
        db: {
          listCollections: () => ({
            next: () => false,
          }),
        },
      };
      const collection = { collectionName: '' };

      const repo = new BaseRepository({
        createCollection,
        db,
        collection,
      } as any);
      await repo.createCollection();

      expect(createCollection).toBeCalled();
    });
  });

  describe('dropCollection', () => {
    it('should call dropCollection', async () => {
      const dropCollection = jest.fn().mockReturnValue({
        exec: jest.fn(),
        maxTimeMS: () => ({ exec: jest.fn() }),
      });
      const db = {
        db: {
          listCollections: () => ({
            next: () => true,
          }),
        },
      };
      const collection = { collectionName: '', drop: jest.fn() };

      const repo = new BaseRepository({
        dropCollection,
        db,
        collection,
      } as any);
      await repo.dropCollection();

      expect(collection.drop).toBeCalled();
    });

    it('should not call dropCollection', async () => {
      const dropCollection = jest.fn().mockReturnValue({
        exec: jest.fn(),
        maxTimeMS: () => ({ exec: jest.fn() }),
      });
      const db = {
        db: {
          listCollections: () => ({
            next: () => false,
          }),
        },
      };
      const collection = { collectionName: '', drop: jest.fn() };

      const repo = new BaseRepository({
        dropCollection,
        db,
        collection,
      } as any);
      await repo.dropCollection();

      expect(collection.drop).not.toBeCalled();
    });
  });

  describe('getPrimaryKey', () => {
    it('should ok', () => {
      const collection = { collectionName: '' };
      const repo = new BaseRepository({ collection } as any);

      repo.getPrimaryKey();
    });
  });

  describe('findByIdOrFail', () => {
    it('should call throwErrorNotFound if findOne return null', async () => {
      const repo = new BaseRepository({} as any);
      repo.findById = jest.fn().mockResolvedValue(null);
      repo.throwErrorNotFound = jest.fn().mockImplementation() as any;

      await repo.findByIdOrFail('');
      expect(repo.throwErrorNotFound).toBeCalled();
    });
  });

  describe('findOneOrFail', () => {
    it('should call throwErrorNotFound if findOne return null', async () => {
      const repo = new BaseRepository({} as any);
      repo.findOne = jest.fn().mockResolvedValue(null);
      repo.throwErrorNotFound = jest.fn().mockImplementation() as any;

      await repo.findOneOrFail('' as any);
      expect(repo.throwErrorNotFound).toBeCalled();
    });
  });

  describe('throwErrorNotFound', () => {
    it('should throw error', () => {
      const repo = new BaseRepository({} as any);

      try {
        repo.throwErrorNotFound();
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
