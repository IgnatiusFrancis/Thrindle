import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const email = 'test@gmail.com';

  it('handles a signup request', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'me123' })
      .expect(201)
      .then((res) => {
        const { id, email, password } = res.body.result.user;

        expect(id).toBeDefined();
        expect(email).toEqual(email);
        expect(password).toBeDefined();
      });
  });

  it('handles a signin request', () => {
    return request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password: 'me123' })
      .expect(201)
      .then((res) => {
        const { id, email, password } = res.body.result.user;
        const { token } = res.body.result;

        expect(id).toBeDefined();
        expect(email).toEqual(email);
        expect(password).toBeDefined();
        expect(token).toBeDefined();
      });
  });
});
