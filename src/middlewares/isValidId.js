import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const isValidId = (req, res, next) => {
  const idKey = Object.keys(req.params)[0];
  const idValue = req.params[idKey];

  if (!isValidObjectId(idValue)) {
    throw createHttpError(400, `Id ${idValue} is not correct!`);
  }
  next();
};
