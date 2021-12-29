import { HermeticServer, startHermeticServer } from '../testing/utils/hermetic';

import { fakeReq } from '../testing/utils/fakeReq';
import { generateUser } from '../testing/utils/generators/generateUser';
import { logoutHandler } from './logout';

describe('login', () => {
  let hermetic: HermeticServer;

  beforeEach(async () => {
    hermetic = await startHermeticServer();
  });

  afterEach(async () => {
    await hermetic.shutdown();
  });

  it('logs user out', async () => {
    const user = await generateUser({
      email: 'test@test.com',
      password: 'password',
    });

    const sessionObj = { userId: user._id };

    const resp = await logoutHandler(
      {},
      { req: fakeReq({ session: sessionObj }) }
    );

    expect(resp.message).toBe('ok');
    expect(sessionObj.userId).toBe(null);
  });

  it('errors if user not logged in', async () => {
    expect.assertions(1);
    try {
      await logoutHandler({}, { req: fakeReq({ session: { userId: null } }) });
    } catch (e) {
      expect(e.message).toBe(`You are not logged in.`);
    }
  });
});
