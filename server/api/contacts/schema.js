const Joi = require('joi')

const base = {
  id: Joi.number().min(1),
  firstName: Joi.string().description('Contact\'s first name'),
  lastName: Joi.string().description('Contact\'s last name'),
  birthday: Joi.any().description('Contact\'s birthday'),
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

const update = {
  ...create,
  createdAt: Joi.any(),
  updatedAt: Joi.any(),
  fullName: Joi.string(),
  addresses: Joi.array().items({
    street: Joi.string().required(),
    number: Joi.string().required(),
    zip: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().length(2).required(),
    id: Joi.number().min(1),
    createdAt: Joi.any(),
    created_at: Joi.any(),
    updatedAt: Joi.any(),
    updated_at: Joi.any(),
    contactId: Joi.number().min(1)
  }).default([])
}

module.exports = {
  base,
  create,
  update
}
