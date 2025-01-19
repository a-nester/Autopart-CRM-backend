import {
  createDiscountTimer,
  getDiscountTimerByProductId,
  upsertDiscountTimer,
} from '../services/discountTimers.js';

export const createTimerController = async (req, res) => {
  try {
    console.log('Request body', req.body);
    const discountTimer = {
      shop: req.body.shop,
      productId: req.body.productId,
      dayDiscountType: req.body.dayDiscountType,
      dayDiscount: req.body.dayDiscount,
      nightDiscountType: req.body.nightDiscountType,
      nightDiscount: req.body.nightDiscount,
    };

    const existingTimer = await getDiscountTimerByProductId(
      discountTimer.productId,
    );

    if (existingTimer && discountTimer.shop === existingTimer.shop) {
      const updatedDiscountTimer = await upsertDiscountTimer(
        existingTimer._id,
        discountTimer,
      );

      return res.status(200).json({
        status: 200,
        message: 'DiscountTimer is already exist and successfuly updated!',
        data: updatedDiscountTimer,
      });
    }

    const createdDiscountTimer = await createDiscountTimer(discountTimer);

    return res.status(201).json({
      status: 201,
      message: 'Discount timer successfully created!',
      data: createdDiscountTimer,
    });
  } catch (error) {
    console.error('Error in createTimerController:', error.message);

    return res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
