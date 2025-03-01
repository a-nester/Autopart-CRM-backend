import Joi from 'joi';

export const createTripSchema = Joi.object({
  id: Joi.string().min(3).max(20).required(),
  driver: Joi.string().min(3).max(20).required(),
  truck: Joi.string().min(3).max(20).required(),
  loadingPlace: Joi.string().min(3).max(30).required(),
  loadDate: Joi.number().min(3).max(50),
  unloadingPlace: Joi.string().min(3).max(30).required(),
  unloadDate: Joi.number().min(3).max(50),
  rangeTo: Joi.number().integer().min(1).max(99999).required(),
  range: Joi.number().integer().min(1).max(99999).required(),
  price: Joi.number().integer().min(1).max(999999).required(),
  currency: Joi.string().min(3).max(30).required(),
  payment_Form: Joi.string().min(3).max(30).required(),
  dispetcher_fee: Joi.number().integer().min(1).max(9999).required(),
  dispetcher_Currency: Joi.string().min(3).max(30).required(),
});
