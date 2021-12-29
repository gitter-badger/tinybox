import { HermeticServer, startHermeticServer } from '../testing/utils/hermetic';

import { fakeReq } from '../testing/utils/fakeReq';
import { generateUser } from '../testing/utils/generators/generateUser';
import { loginHandler } from './login';

describe('login', () => {
  let hermetic: HermeticServer;

  beforeEach(async () => {
    hermetic = await startHermeticServer();
  });

  afterEach(async () => {
    await hermetic.shutdown();
  });

  it('logs user in', async () => {
    const user = await generateUser({
      email: 'test@test.com',
      password: 'password',
    });
    const sessionObj = { userId: null };
    const resp = await loginHandler(
      {
        email: 'test@test.com',
        password: 'password',
      },
      { req: fakeReq({ session: sessionObj }) }
    );

    expect(resp.message).toBe('ok');
    expect(sessionObj.userId).toBe(user._id);
  });

  it('errors if already authenticated', async () => {
    const user = await generateUser({
      email: 'test@test.com',
      password: 'password',
    });
    expect.assertions(1);
    try {
      await loginHandler(
        {
          email: 'test@test.com',
          password: 'password',
        },
        { req: fakeReq({ session: { userId: user._id } }) }
      );
    } catch (e) {
      expect(e.message).toBe(`You are already logged in, please logout first.`);
    }
  });

  it('errors if invalid email', async () => {
    await generateUser({
      email: 'test@test.com',
      password: 'password',
    });
    expect.assertions(1);
    try {
      await loginHandler(
        {
          email: 'test2@test.com',
          password: 'password',
        },
        { req: fakeReq() }
      );
    } catch (e) {
      expect(e.message).toBe(
        `User with email 'test2@test.com' cannot be found.`
      );
    }
  });

  it('errors if invalid password', async () => {
    await generateUser({
      email: 'test@test.com',
      password: 'password',
    });
    expect.assertions(1);
    try {
      await loginHandler(
        {
          email: 'test@test.com',
          password: 'password2',
        },
        { req: fakeReq() }
      );
    } catch (e) {
      expect(e.message).toBe(`Invalid password.`);
    }
  });
});
