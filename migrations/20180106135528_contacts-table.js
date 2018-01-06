
exports.up = function (knex, Promise) {
  return knex.schema
    .createTable('contacts', table => {
      table.increments('id').primary()
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.timestamp('birthday')
      table.specificType('emails', 'text[]')
      table.specificType('phone_numbers', 'text[]')
      table.timestamps()
    })
    .createTable('addresses', table => {
      table.increments('id').primary()
      table.string('street').notNullable()
      table.string('number').notNullable()
      table.string('zip').notNullable()
      table.string('city').notNullable()
      table.string('state', 2).notNullable()
      table.integer('contact_id').references('contacts.id')
      table.timestamps()
    })
}

exports.down = function (knex, Promise) {
  return knex.schema
    .dropTable('addresses')
    .dropTable('contacts')
}
