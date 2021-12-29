import { HermeticServer, startHermeticServer } from '../testing/utils/hermetic';

import { Home } from '@tinybox/models';
import { deleteHomeHandler } from './deleteHome';
import { fakeReq } from '../testing/utils/fakeReq';
import { generateHome } from '../testing/utils/generators/generateHome';
import { generateUser } from '../testing/utils/generators/generateUser';

describe('deleteHome', () => {
  let hermetic: HermeticServer;

  beforeEach(async () => {
    hermetic = await startHermeticServer();
  });

  afterEach(async () => {
    await hermetic.shutdown();
  });

  it('deletes home', async () => {
    const user = await generateUser();
    const home = await generateHome({ ownerId: user._id });
    const resp = await deleteHomeHandler(
      {
        id: home._id,
      },
      { req: fakeReq({ session: { userId: user._id } }) }
    );

    expect(resp.id).toBeTruthy();
    const newHome = await Home.findOne({ id: resp.id });
    expect(newHome).toBeFalsy();
  });

  it('errors if home not found', async () => {
    const user = await generateUser();
    expect.assertions(1);
    try {
      await deleteHomeHandler(
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
      await deleteHomeHandler(
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
