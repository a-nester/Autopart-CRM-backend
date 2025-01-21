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

export const setDiscountsToProm = async (period) => {
  const shops = ['AvtoKlan', 'AutoAx', 'iDoAuto', 'ToAuto'];
  const results = [];
  // const PERIOD = { day: dayDiscount };

  for (const shop of shops) {
    try {
      const timers = await getAllDiscountTimersByShop(shop);

      if (timers.length === 0) {
        console.log(`No timers found for shop ${shop}`);
        results.push({ shop, message: 'No timers found' });
        continue; // пропускаємо магазин без таймерів
      }

      const timersToSend = timers.map((timer) => {
        const PERIOD_VALUE = {
          day: timer.dayDiscount,
          night: timer.nightDiscount,
        };
        const PERIOD_TYPE = {
          day: timer.dayDiscountType,
          night: timer.nightDiscountType,
        };
        return {
          id: timer.productId,
          // presence: 'available',
          // quantity_in_stock: 10,
          // price: 2008,
          discount: {
            value: PERIOD_VALUE[period],
            type: PERIOD_TYPE[period],
            date_start: getFormattedDateWithOffset(),
            date_end: getFormattedDateWithOffset(3),
          },
        };
      });
      console.log('timersToSend', timersToSend);

      const response = await editProductsByShop(shop, timersToSend);
      results.push({ shop, response });
    } catch (error) {
      console.error(`Error processing shop ${shop}`, error);
      results.push({ shop, error: error.message });
    }
  }

  return results;
};

// id: product.promProductId,
//         presence: 'available',
//         quantity_in_stock:
//           product.quantity === '+' ? 100 : Number(product.quantity),
//         price: product.promPrice,
//         discount: product.promDiscount
