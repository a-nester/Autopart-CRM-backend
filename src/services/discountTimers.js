import { DiscountTimerCollection } from '../db/models/DiscountTimer.js';

export const createDiscountTimer = async (payload) => {
  const discountTimer = await DiscountTimerCollection.create(payload);
  return discountTimer;
};
