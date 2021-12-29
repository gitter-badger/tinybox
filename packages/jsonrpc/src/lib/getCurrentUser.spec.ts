import { HermeticServer, startHermeticServer } from '../testing/utils/hermetic';

import { fakeReq } from '../testing/utils/fakeReq';
import { generateUser } from '../testing/utils/generators/generateUser';
import { getCurrentUserHandler } from './getCurrentUser';

describe('getCurrentUser', () => {
  let hermetic: HermeticServer;

  beforeEach(async () => {
    hermetic = await startHermeticServer();
  });

  afterEach(async () => {
    await hermetic.shutdown();
  });

  it('gets current user', async () => {
    const user = await generateUser();
    const resp = await getCurrentUserHandler(
      {},
      { req: fakeReq({ session: { userId: user._id } }) }
    );

    expect(resp.id).toBe(user._id);
    expect(resp.email).toBe(user.email);
    expect(resp.name).toBe(user.name);
  });

  it('errors if user not found', async () => {
    await generateUser();
    expect.assertions(2);
    const fakeReqObject = { session: { userId: 'invalid_id' } };
    try {
      await getCurrentUserHandler({}, { req: fakeReq(fakeReqObject) });
    } catch (e) {
      expect(e.message).toBe(
        `Something went wrong internally, try again later.`
      );
      expect(fakeReqObject.session.userId).toBe(null);
    }
  });
});
