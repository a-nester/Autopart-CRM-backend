import {
  createDiscountTimer,
  getAllDiscountTimersByShop,
  getDiscountTimerByProductId,
  upsertDiscountTimer,
} from '../services/discountTimers.js';
import { getFormattedDateWithOffset } from '../utils/formatDate.js';
import { editProductsByShop } from '../utils/api.js';

export const createTimerController = async (req, res) => {
  try {
    // console.log('Request body', req.body);
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

    // console.log('newTimer');

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

export const setDiscountsToProm = async () => {
  const shops = ['Avtoklan', 'AutoAx', 'iDoAuto', 'ToAuto'];
  const results = [];

  for (const shop of shops) {
    try {
      const timers = await getAllDiscountTimersByShop(shop);
      if (timers.length === 0) {
        console.log(`No timers found for shop ${shop}`);
        results.push({ shop, message: 'No timers found' });
        continue; // пропускаємо магазин без таймерів
      }

      const timersToSend = timers.map((timer) => ({
        id: timer.id,
        discount: {
          value: timer.dayDiscount,
          type: timer.dayDiscountType,
          date_start: getFormattedDateWithOffset(),
          date_end: getFormattedDateWithOffset(3),
        },
      }));

      const response = await editProductsByShop(shop, timersToSend);
      results.push({ shop, response });
    } catch (error) {
      console.error(`Error processing shop ${shop}`, error);
      results.push({ shop, error: error.message });
    }
  }

  return results;
};
