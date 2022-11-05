import { infoLog } from 'src/shared/logger/logger.helper';

beforeAll(() => {
  infoLog({ start: new Date() }, 'Test started');
});

afterAll(() => {
  infoLog({ end: new Date() }, 'Test ended');
});
