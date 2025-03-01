import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  console.log('Request', req.body);
  try {
    await schema.validateAsync(req.body, {
      abortEarly: false,
    });
    console.log('Validation ok!');

    next();
  } catch (err) {
    const error = createHttpError(400, 'Bad request', {
      errors: err.details,
    });
    next(error);
  }
};
