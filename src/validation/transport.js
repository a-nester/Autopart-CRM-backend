import Joi from 'joi';

export const createTripSchema = Joi.object({
  id: Joi.string().min(3).max(20),
  driver: Joi.string().min(3).max(20).required(),
  truck: Joi.string().min(3).max(20).required(),
  loadingPlace: Joi.string().min(3).max(30).required(),
  loadDate: Joi.number().min(3).max(99999999999999),
  unloadingPlace: Joi.string().min(3).max(30).required(),
  unloadDate: Joi.number().min(3).max(99999999999999),
  rangeTo: Joi.number().integer().min(1).max(99999).required(),
  range: Joi.number().integer().min(1).max(99999).required(),
  price: Joi.number().integer().min(1).max(999999).required(),
  currency: Joi.string().min(3).max(30).required(),
  payment_Form: Joi.string().min(3).max(30).required(),
  dispetcher_id: Joi.string().min(3).max(30).required(),
  dispetcher_fee: Joi.number().integer().min(1).max(9999).required(),
  dispetcher_Currency: Joi.string().min(3).max(30).required(),
});

export const createCustomerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  company: Joi.string().min(3).max(50),
  phone: Joi.string().min(3).max(50),
  email: Joi.string().min(3).max(50),
});
