const Joi = require('joi')

const base = {
  id: Joi.number().min(1),
  firstName: Joi.string().description('Contact\'s first name'),
  lastName: Joi.string().description('Contact\'s last name'),
  birthday: Joi.date().description('Contact\'s birthday'),
  emails: Joi.array().items(Joi.string().email()).description('Contact\'s emails').default([]),
  phoneNumbers: Joi.array().items(Joi.string()).description('Contact\'s phone numbers').default([]),
  addresses: Joi.array().items(
    Joi.object().keys({
      street: Joi.string().required(),
      number: Joi.string().required(),
      zip: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().length(2).required()
    })
  ).default([])
}

const create = {
  ...base,
  firstName: base.firstName.required(),
  lastName: base.lastName.required(),
  emails: base.emails.min(1),
  phoneNumbers: base.phoneNumbers.min(1)
}

module.exports = {
  base,
  create
}
