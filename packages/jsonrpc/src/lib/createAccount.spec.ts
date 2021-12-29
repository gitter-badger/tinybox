import { HermeticServer, startHermeticServer } from '../testing/utils/hermetic';

import { User } from '@tinybox/models';
import { createAccountHandler } from './createAccount';
import { fakeReq } from '../testing/utils/fakeReq';
import { generateUser } from '../testing/utils/generators/generateUser';

describe('createAccount', () => {
  let hermetic: HermeticServer;

  beforeEach(async () => {
    hermetic = await startHermeticServer();
  });

  afterEach(async () => {
    await hermetic.shutdown();
  });

  it('creates new account', async () => {
    const resp = await createAccountHandler(
      {
        name: 'hello',
        password: 'my password',
        email: 'test@sample.com',
      },
      { req: fakeReq() }
    );

    expect(resp.id).toBeTruthy();
    const user = await User.findOne({ _id: resp.id });
    expect(user).toBeTruthy();
    expect(user.name).toBe('hello');
    expect(user.email).toBe('test@sample.com');
  });

  it('fails if email invalid', async () => {
    expect.assertions(1);
    try {
      await createAccountHandler(
        {
          name: 'hello',
          password: 'my password',
          email: 'invalid!',
        },
        { req: fakeReq() }
      );
    } catch (e) {
      expect(e.message).toBe('Invalid email address provided.');
    }
  });

  it('fails if password too short', async () => {
    expect.assertions(1);
    try {
      await createAccountHandler(
        {
          name: 'hello',
          password: 'hi',
          email: 'hi@example.com',
        },
        { req: fakeReq() }
      );
    } catch (e) {
      expect(e.message).toBe('Password must be at least 8 characters long.');
    }
  });

  it('fails if name not provided', async () => {
    expect.assertions(1);
    try {
      await createAccountHandler(
        {
          name: null,
          password: 'hi',
          email: 'hi@example.com',
        },
        { req: fakeReq() }
      );
    } catch (e) {
      expect(e.message).toBe('You must provide a name.');
    }
  });

  it('fails if password not provided', async () => {
    expect.assertions(1);
    try {
      await createAccountHandler(
        {
          name: 'hi',
          password: null,
          email: 'hi@example.com',
        },
        { req: fakeReq() }
      );
    } catch (e) {
      expect(e.message).toBe('You must provide a password.');
    }
  });

  it('fails if duplicate email', async () => {
    expect.assertions(1);
    await generateUser({
      name: 'hi',
      password: 'hey',
      email: 'hi@example.com',
    });
    try {
      await createAccountHandler(
        {
          name: 'hello',
          password: 'my password',
          email: 'hi@example.com',
        },
        { req: fakeReq() }
      );
    } catch (e) {
      expect(e.message).toBe(
        "User with email 'hi@example.com' already exists."
      );
    }
  });
});
