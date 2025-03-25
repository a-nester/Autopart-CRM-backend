import Joi from 'joi';

export const updateGroupSchema = Joi.object({
  excellGroupId: Joi.number().min(1).max(9999999).required(),
  promGroup: Joi.object({
    id: Joi.number().min(1).required(),
    name: Joi.string().min(1).max(255).required(),
    discountValue: Joi.number().max(99),
    discountType: Joi.string().min(3).max(20),
  }).required(),
  promShop: Joi.string()
    .min(3)
    .max(20)
    .valid('AvtoKlan', 'AutoAx', 'iDoAuto', 'ToAuto'),
});
