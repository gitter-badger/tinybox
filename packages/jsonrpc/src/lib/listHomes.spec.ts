import { HermeticServer, startHermeticServer } from '../testing/utils/hermetic';

import { fakeReq } from '../testing/utils/fakeReq';
import { generateHome } from '../testing/utils/generators/generateHome';
import { generateUser } from '../testing/utils/generators/generateUser';
import { listHomesHandler } from './listHomes';

describe('listHomes', () => {
  let hermetic: HermeticServer;

  beforeEach(async () => {
    hermetic = await startHermeticServer();
  });

  afterEach(async () => {
    await hermetic.shutdown();
  });

  it('lists all homes', async () => {
    const user = await generateUser();
    const user2 = await generateUser({ email: 'user2@test.com' });
    const home = await generateHome({ ownerId: user._id });
    const home2 = await generateHome({ ownerId: user._id });
    await generateHome({ ownerId: user2._id });
    const resp = await listHomesHandler(
      {},
      { req: fakeReq({ session: { userId: user._id } }) }
    );

    expect(resp.homes.length).toBe(2);
    expect(resp.homes[0].id).toBe(home._id);
    expect(resp.homes[1].id).toBe(home2._id);
  });

  it('errors if user not authenticated', async () => {
    expect.assertions(1);
    try {
      await listHomesHandler({}, { req: fakeReq() });
    } catch (e) {
      expect(e.message).toBe(`You are not logged in.`);
    }
  });
});
