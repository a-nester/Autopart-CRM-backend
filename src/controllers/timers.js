import {
  createDiscountTimer,
  getDiscountTimerByProductId,
  upsertDiscountTimer,
} from '../services/discountTimers.js';

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

  const timer = await getDiscountTimerByProductId(discountTimer.productId);

  if (timer && discountTimer.shop === timer.shop) {
    const updatedDiscountTimer = await upsertDiscountTimer(
      timer._id,
      discountTimer,
    );

    res.status(200).json({
      status: 200,
      message: 'DiscountTimer is already exist and successfuly updated!',
      data: updatedDiscountTimer,
    });
  }

  const createdDiscountTimer = await createDiscountTimer(discountTimer);

  res.status(200).json({
    status: 200,
    message: 'Already obtain body!',
    data: createdDiscountTimer,
  });
};
