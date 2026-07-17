const prisma = require('../config/database');

class BaseRepository {
  constructor(model) {
    this.model = prisma[model];
    this.prisma = prisma;
  }

  findMany(args = {}) {
    return this.model.findMany(args);
  }

  findUnique(args) {
    return this.model.findUnique(args);
  }

  findFirst(args) {
    return this.model.findFirst(args);
  }

  create(data) {
    return this.model.create({ data });
  }

  update(id, data) {
    return this.model.update({ where: { id }, data });
  }

  delete(id) {
    return this.model.delete({ where: { id } });
  }

  count(where = {}) {
    return this.model.count({ where });
  }

  upsert(args) {
    return this.model.upsert(args);
  }
}

module.exports = BaseRepository;
