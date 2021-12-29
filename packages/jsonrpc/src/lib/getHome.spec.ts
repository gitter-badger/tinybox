import { HermeticServer, startHermeticServer } from '../testing/utils/hermetic';

import { fakeReq } from '../testing/utils/fakeReq';
import { generateHome } from '../testing/utils/generators/generateHome';
import { generateUser } from '../testing/utils/generators/generateUser';
import { getHomeHandler } from './getHome';

describe('getHome', () => {
  let hermetic: HermeticServer;

  beforeEach(async () => {
    hermetic = await startHermeticServer();
  });

  afterEach(async () => {
    await hermetic.shutdown();
  });

  it('returns home', async () => {
    const user = await generateUser();
    const home = await generateHome({ ownerId: user._id });
    const resp = await getHomeHandler(
      {
        id: home._id,
      },
      { req: fakeReq({ session: { userId: user._id } }) }
    );

    expect(resp.home).toBeTruthy();
    expect(resp.home.id).toBe(home._id);
    expect(resp.home.name).toBe(home.name);
    expect(resp.home.ownerId).toBe(home.ownerId);
  });

  it('errors if home not found', async () => {
    const user = await generateUser();
    expect.assertions(1);
    try {
      await getHomeHandler(
        {
          id: 'invalid_id',
        },
        { req: fakeReq({ session: { userId: user._id } }) }
      );
    } catch (e) {
      expect(e.message).toBe(
        `Home with ID 'invalid_id' cannot be found, make sure you have access to it.`
      );
    }
  });

  it('errors if user is not owner', async () => {
    const user = await generateUser();
    const user2 = await generateUser({ email: 'user2@test.com' });
    const home = await generateHome({ ownerId: user2._id });
    expect.assertions(1);
    try {
      await getHomeHandler(
        {
          id: home._id,
        },
        { req: fakeReq({ session: { userId: user._id } }) }
      );
    } catch (e) {
      expect(e.message).toBe(
        `Home with ID '${home._id}' cannot be found, make sure you have access to it.`
      );
    }
  });
});
