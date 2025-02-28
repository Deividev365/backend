/* eslint-disable prefer-const */
/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
const knex = require('../database/connection');

class User {
  async saveIdToken(idToken, sub) {
    try {
      await knex.update({ idToken }).table('usuario').where({ sub });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async saveIdCursoProntuario(idCurso, prontuario_, sub) {
    try {
      await knex.update({ id_curso: idCurso, prontuario: prontuario_ }).table('usuario').where({ sub });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async checarProntuario(prontuario, sub) {
    const id = await knex.select(['id']).table('usuario').where({ sub }).first();
    const allProntuario = await knex.select('prontuario').table('usuario').whereNot({ id: id.id });
    for (const i in allProntuario) {
      if (allProntuario[i].prontuario === prontuario) {
        return false;
      }
    }
    return true;
  }

  async register(name, email, picture, idToken, sub) {
    try {
      await knex.insert({
        id_curso: null, nome: name, email, foto: picture, idToken, sub,
      }).table('usuario');
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async findByEmail(email) {
    try {
      const result = await knex.select(['email', 'nome', 'foto']).table('usuario').where({ email });

      if (result.length > 0) {
        return result[0];
      }
      return undefined;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  async findBySub(sub) {
    try {
      const result = await knex.select(['email', 'nome', 'foto']).table('usuario').where({ sub });

      if (result.length > 0) {
        return result[0];
      }
      return undefined;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  async findByToken(idToken) {
    try {
      const result = await knex.select(['email', 'nome', 'foto']).table('usuario').where({ idToken });

      if (result.length > 0) {
        return result[0];
      }
      return undefined;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  async findAll() {
    try {
      const result = await knex.select('*').table('usuario').orderBy('id', 'asc');
      return result;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async checkAmount(sub) {
    try {
      const idCurso = await knex.select(['id_curso']).table('usuario').where({ sub }).first();
      const colegas = await knex.distinct().select('id', 'nome').table('usuario').whereNot('email', 'like', '%@aluno.ifsp.edu.br%')
        .where({ id_curso: idCurso.id_curso });
      for (const k in colegas) {
        const data = await knex.distinct().select('id_usuario_aluno').table('ticket').where({ id_usuario_orientador: colegas[k].id });
        if (data.length > 0) {
          let count = 0;
          for (const y in data) {
            const processo = await knex.select('pe.situação').from('processo_estagio AS pe').leftJoin('ticket AS t', 't.id_processo_estagio', 'pe.id').where({ 't.id_usuario_aluno': data[y].id_usuario_aluno });
            if (processo[0].situação !== false) {
              count += 1;
            }
          }
          colegas[k].quantidade = count;
        } else {
          let count = 0;
          colegas[k].quantidade = count;
        }
      }
      return colegas.sort((a, b) => parseFloat(b.quantidade) - parseFloat(a.quantidade));
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  // async findById(id) {
  //   try {
  //   var result = await knex.select(['id', 'email', 'name', 'role']).table("users")
  //   .where({ id: id });

  //     if (result.length > 0) {
  //       return result[0];
  //     } else {
  //       return undefined;
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     return undefined;
  //   }
  // }

  // async findEmail(email) {
  //   try {
  //     var result = await knex.select("*").from("users").where({ email: email });
  //     if (result.length > 0) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     return false;
  //   }
  // }
}

module.exports = new User();
