const knex = require('../database/connection');

class Estagio {
  async findAll() {
    try {
      const result = await knex.select('*').table('Processo_Estagio');
      return result;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async limpar() {
    try {
      await knex('documento').del();
      await knex('ticket').del();
      await knex('processo_estagio').del();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

module.exports = new Estagio();
