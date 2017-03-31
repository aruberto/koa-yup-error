# koa-yup-error

Intercept yup validation errors and convert them into 400 for koa-error middleware.

## Requirements
* node __^7.6.0__

## Installation
```
npm install --save koa koa-error koa-yup-error
```

## Usage
```
import Koa from 'koa';
import error from 'koa-error';
import yupError from 'koa-yup-error';

// make sure to use after koa-error
const app = new Koa();
app.use(error());
app.use(yupError());
```

## License
MIT
