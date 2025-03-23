import Joi from 'joi';

export const createStoreSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  company: Joi.string().min(3).max(30).required(),
});
