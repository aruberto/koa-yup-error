import { ValidationError } from 'yup';

export default function createKoaYupErrorMiddleware () {
  return async function koaYupErrorMiddleware (ctx, next) {
    try {
      await next();
    } catch (err) {
      if (ValidationError.isError(err)) {
        const validationErr = new Error(err.errors.join(', '));

        validationErr.status = 400;
        validationErr.expose = true;

        throw validationErr;
      } else {
        throw err;
      }
    }
  };
}
