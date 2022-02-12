import { HermeticServer, startHermeticServer } from '../testing/utils/hermetic';

import { Box } from '@tinybox/models';
import { deleteBoxHandler } from './deleteBox';
import { fakeReq } from '../testing/utils/fakeReq';
import { generateBox } from '../testing/utils/generators/generateBox';
import { generateHome } from '../testing/utils/generators/generateHome';
import { generateUser } from '../testing/utils/generators/generateUser';

describe('deleteBox', () => {
  let hermetic: HermeticServer;

  beforeEach(async () => {
    hermetic = await startHermeticServer();
  });

  afterEach(async () => {
    await hermetic.shutdown();
  });

  it('deletes box', async () => {
    const user = await generateUser();
    const home = await generateHome({ ownerId: user._id });
    const box = await generateBox({ name: 'test', homeId: home._id });
    const resp = await deleteBoxHandler(
      {
        homeId: home._id,
        boxId: box._id,
      },
      { req: fakeReq({ session: { userId: user._id } }) }
    );

    expect(resp.id).toBeTruthy();
    expect(await Box.findOne({ _id: box._id })).toBeFalsy();
  });

  it('errors if box not found', async () => {
    const user = await generateUser();
    const home = await generateHome({ ownerId: user._id });
    expect.assertions(1);
    try {
      await deleteBoxHandler(
        {
          homeId: home._id,
          boxId: 'invalid_id',
        },
        { req: fakeReq({ session: { userId: user._id } }) }
      );
    } catch (e) {
      expect(e.message).toBe(
        `Box with ID 'invalid_id' cannot be found, make sure you have access to it.`
      );
    }
  });

  it('errors if home not found', async () => {
    const user = await generateUser();
    expect.assertions(1);
    try {
      await deleteBoxHandler(
        {
          homeId: 'invalid_id',
          boxId: 'invalid_id',
        },
        { req: fakeReq({ session: { userId: user._id } }) }
      );
    } catch (e) {
      expect(e.message).toBe(
        `Home with ID 'invalid_id' cannot be found, make sure you have access to it.`
      );
    }
  });

  it('errors if not authenticated', async () => {
    expect.assertions(1);
    try {
      await deleteBoxHandler(
        {
          homeId: 'invalid_id',
          boxId: 'invalid_id',
        },
        { req: fakeReq({ session: { userId: null } }) }
      );
    } catch (e) {
      expect(e.message).toBe(`You are not logged in.`);
    }
  });
});
