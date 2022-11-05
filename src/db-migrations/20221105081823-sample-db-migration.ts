/* eslint-disable @typescript-eslint/no-unused-vars */
import { Db } from 'mongodb';

export = {
  async up(db: Db) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
  },
  async down(db: Db) {
    // TODO write the statements to rollback your migration (if possible)
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
  },
};
