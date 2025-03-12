import Joi from 'joi';

export const createTripSchema = Joi.object({
  // _id: Joi.string().min(3).max(30),
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
  weight: Joi.number().min(2).max(25000).required(),
});

export const updateTripSchema = Joi.object({
  // _id: Joi.string().min(3).max(20),
  driver: Joi.string().min(3).max(20),
  truck: Joi.string().min(3).max(20),
  loadingPlace: Joi.string().min(3).max(30),
  loadDate: Joi.number().min(3).max(99999999999999),
  unloadingPlace: Joi.string().min(3).max(30),
  unloadDate: Joi.number().min(3).max(99999999999999),
  rangeTo: Joi.number().integer().min(1).max(99999),
  range: Joi.number().integer().min(1).max(99999),
  price: Joi.number().integer().min(1).max(999999),
  currency: Joi.string().min(3).max(30),
  payment_Form: Joi.string().min(3).max(30),
  dispetcher_id: Joi.string().min(3).max(30),
  dispetcher_fee: Joi.number().integer().min(1).max(9999),
  dispetcher_Currency: Joi.string().min(3).max(30),
  weight: Joi.number().min(2).max(25000),
});

export const createCustomerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  company: Joi.string().min(3).max(50),
  phone: Joi.string().min(3).max(50),
  email: Joi.string().min(3).max(50),
});

export const createCostSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  date: Joi.number().min(3).max(99999999999999).required(),
  odometr: Joi.number().min(3).max(99999999999999),
  costType: Joi.string().min(3).max(20).required(),
  price: Joi.number().min(1).max(99999999999999).required(),
  currency: Joi.string().min(3).max(20).required(),
  companyId: Joi.string().min(3).max(20).required(),
  truck: Joi.string().min(3).max(20),
  driver: Joi.string().min(3).max(20),
  trip: Joi.string().min(3).max(20),
});
