import { createDiscountTimer } from '../services/discountTimers';

export const createTimerController = async (req, res) => {
  console.log(req.body);
  const discountTimer = {
    shop: req.body.shop,
    productId: req.body.productId,
    dayDiscountType: req.body.dayDiscountType,
    dayDiscount: req.body.dayDiscount,
    nightDiscountType: req.body.nightDiscountType,
    nightDiscount: req.body.nightDiscount,
  };

  const createdDiscountTimer = await createDiscountTimer(discountTimer);

  res.status(200).json({
    status: 200,
    message: 'Already obtain body!',
    data: createdDiscountTimer,
  });
};
