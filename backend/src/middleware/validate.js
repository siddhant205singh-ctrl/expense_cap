import { ZodError } from 'zod';
import ApiError from '../utils/ApiError.js';

export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return next(new ApiError(400, errorMessage));
    }
    next(error);
  }
};
