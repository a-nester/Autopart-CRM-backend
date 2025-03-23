export const ctrlWrapper = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (err) {
      console.error('Error in controller:', err);
      next(err);
    }
  };
};
