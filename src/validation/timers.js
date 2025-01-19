import Joi from 'joi';

export const createDiscountTimerSchema = Joi.object({
  shop: Joi.string().min(3).max(20).required(),
  productId: Joi.number().integer().min(0).max(999999999999).required(),
  dayDiscountType: Joi.string().min(3).max(20).required(),
  dayDiscount: Joi.number().integer().min(0).max(99999).required(),
  nightDiscountType: Joi.string().min(3).max(20).required(),
  nightDiscount: Joi.number().integer().min(0).max(99999).required(),
});
