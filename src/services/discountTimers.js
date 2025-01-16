import { DiscountTimerCollection } from '../db/models/DiscountTimer.js';

export const getDiscountTimerByProductId = async (productId) => {
  const discountTimer = await DiscountTimerCollection.findOne({ productId });
  return discountTimer;
};

export const createDiscountTimer = async (payload) => {
  const discountTimer = await DiscountTimerCollection.create(payload);
  return discountTimer;
};

export const upsertDiscountTimer = async (timerId, payload, option = {}) => {
  const rawResult = await DiscountTimerCollection.findOneAndUpdate(
    { _id: timerId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...option,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    discountTimer: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
