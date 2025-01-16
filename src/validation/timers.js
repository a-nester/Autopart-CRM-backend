import Joi from 'joi';

export const createDiscountTimerSchema = Joi.object({
  shop: Joi.string().min(3).max(20).required(),
  productId: Joi.number().integer().min(0).max(9999999999).required(),
});
