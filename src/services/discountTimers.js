import { DiscountTimerCollection } from '../db/models/DiscountTimer';

export const createDiscountTimer = async (payload) => {
  const discountTimer = await DiscountTimerCollection.create(payload);
  return discountTimer;
};
