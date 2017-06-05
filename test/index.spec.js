/* eslint-disable no-unused-expressions */

import Koa from 'koa';
import error from 'koa-error';
import Router from 'koa-router';
import supertest from 'supertest';
import { expect } from 'chai';
import yup from 'yup';

import yupError from '../src';

const app = new Koa();
app.use(error());
app.use(yupError());

const schema =
  yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required()
  });

const router = new Router();

router.get('/test1', async ctx => {
  const value = await schema.validate({
    name: 'Joe Blow',
    email: 'jblow@blah.com'
  });

  ctx.body = value;
});

router.get('/test2', async ctx => {
  const value = await schema.validate({
    name: 'Joe Blow',
    email: 'jblow'
  });

  ctx.body = value;
});

router.get('/test3', async ctx => {
  throw new Error('random error');
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(8080);

const request = supertest.agent(app.listen());

describe('Koa Yup Error Middleware', () => {
  it('should return data when no error is thrown', async () => {
    return request.get('/test1')
      .set('Accept', 'application/json')
      .expect(200)
      .then(res => {
        expect(res.body).to.deep.equal({
          name: 'Joe Blow',
          email: 'jblow@blah.com'
        });
      });
  });

  it('should return bad request when yup validation error is thrown', async () => {
    return request.get('/test2')
      .set('Accept', 'application/json')
      .expect(400)
      .then(res => {
        expect(res.body.error).to.equal('email must be a valid email');
      });
  });

  it('should return internal server error when non-yup validation error is thrown', async () => {
    return request.get('/test3')
      .set('Accept', 'application/json')
      .expect(500);
  });
});
