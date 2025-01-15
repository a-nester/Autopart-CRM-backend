import Joi from 'joi';

export const createDiscountTimerSchema = Joi.object({
  shop: Joi.string().min(3).max(20).required(),
  productId: Joi.number().max(10).required(),
});
