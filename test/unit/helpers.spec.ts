import { convertObject } from '../../src/shared/mongoose/helpers';
import { Types } from 'mongoose';

describe('mongoose convertObject', () => {
  it('convert set to array', () => {
    const result = [1, 2, 'three'];
    const obj = new Set([1, 2, 'three']);
    expect(convertObject(obj)).toStrictEqual(result);
  });

  it('convert map to plain object', () => {
    const result = { a: 1, b: 2, c: [3, 4] };
    const obj = new Map<any, any>([
      ['a', 1],
      ['b', 2],
      ['c', [3, 4]],
    ]);
    expect(convertObject(obj)).toStrictEqual(result);
  });

  it('convert generic object', () => {
    const obj = {
      set: new Set([1, 2, 'three']),
      map: new Map<any, any>([
        ['a', 1],
        ['b', 2],
        ['c', [3, 4]],
      ]),
      _id: new Types.ObjectId(1234),
      amount: Types.Decimal128.fromString('12345.556'),
    };
    expect(
      convertObject(obj, {
        exclude: ['map.a', 'map.b', 'amount'],
        keymap: { _id: 'id', amount: 'amount-map' },
      }),
    ).toStrictEqual({
      set: [1, 2, 'three'],
      map: {
        c: [3, 4],
      },
      id: expect.anything(),
      'amount-map': 12345.556,
    });
  });
});
