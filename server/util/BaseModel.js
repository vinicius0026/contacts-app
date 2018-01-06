/**
 * BaseModel Class
 * This class extends Objection Model in order to achieve 2 objectives:
 * - Names are converted between snakeCase and camel_case so that the database only knows about camel_case names
 * and the application (apart from this class) only knows about snakeCase names
 * - createdAt and updatedAt timestamps are stored whenever an object is created or updated
 */
const Model = require('objection').Model
const _ = require('lodash')
const snakeCase = _.memoize(_.snakeCase)
const camelCase = _.memoize(_.camelCase)

class BaseModel extends Model {
  $formatDatabaseJson (json) {
    json = super.$formatDatabaseJson(json)

    return _.mapKeys(json, (value, key) => snakeCase(key))
  }

  $parseDatabaseJson (json) {
    return super.$parseDatabaseJson(
      _.mapKeys(json, (value, key) => camelCase(key))
    )
  }

  $beforeInsert () {
    this.created_at = new Date().toISOString()
  }

  $beforeUpdate () {
    this.updated_at = new Date().toISOString()
  }
}

module.exports = BaseModel
