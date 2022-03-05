import { HermeticServer, startHermeticServer } from '../testing/utils/hermetic';

import { fakeReq } from '../testing/utils/fakeReq';
import { generateBox } from '../testing/utils/generators/generateBox';
import { generateHome } from '../testing/utils/generators/generateHome';
import { generateUser } from '../testing/utils/generators/generateUser';
import { getBoxHandler } from './getBox';

describe('getHome', () => {
  let hermetic: HermeticServer;

  beforeEach(async () => {
    hermetic = await startHermeticServer();
  });

  afterEach(async () => {
    await hermetic.shutdown();
  });

  it('returns box', async () => {
    const user = await generateUser();
    const home = await generateHome({ ownerId: user._id });
    const box = await generateBox({ name: 'test', homeId: home._id });
    const resp = await getBoxHandler(
      {
        homeId: home._id,
        boxId: box._id,
      },
      { req: fakeReq({ session: { userId: user._id } }) }
    );

    expect(resp.box).toBeTruthy();
    expect(resp.box.id).toBe(box._id);
    expect(resp.box.name).toBe(box.name);
    expect(resp.box.homeId).toBe(box.homeId);
  });

  it('returns box with parent chain', async () => {
    const user = await generateUser();
    const home = await generateHome({ ownerId: user._id });
    const box = await generateBox({ name: 'test', homeId: home._id });
    const box1 = await generateBox({
      name: 'test2',
      homeId: home._id,
      parentId: box._id,
    });
    const box2 = await generateBox({
      name: 'test3',
      homeId: home._id,
      parentId: box1._id,
    });

    const resp = await getBoxHandler(
      {
        homeId: home._id,
        boxId: box2._id,
      },
      { req: fakeReq({ session: { userId: user._id } }) }
    );

    expect(resp.box).toBeTruthy();
    expect(resp.box.id).toBe(box2._id);
    expect(resp.box.name).toBe(box2.name);
    expect(resp.box.homeId).toBe(box2.homeId);
    expect(resp.parentChain.length).toBe(2);
    expect(resp.parentChain[0].id).toBe(box1._id);
    expect(resp.parentChain[1].id).toBe(box._id);
  });

  it('errors if box not found', async () => {
    const user = await generateUser();
    const home = await generateHome({ ownerId: user._id });
    expect.assertions(1);
    try {
      await getBoxHandler(
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
      await getBoxHandler(
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
      await getBoxHandler(
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
