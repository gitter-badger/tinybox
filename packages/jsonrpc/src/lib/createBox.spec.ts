import { HermeticServer, startHermeticServer } from '../testing/utils/hermetic';

import { Box } from '@tinybox/models';
import { createBoxHandler } from './createBox';
import { fakeReq } from '../testing/utils/fakeReq';
import { generateBox } from '../testing/utils/generators/generateBox';
import { generateHome } from '../testing/utils/generators/generateHome';
import { generateUser } from '../testing/utils/generators/generateUser';

describe('createBox', () => {
  let hermetic: HermeticServer;

  beforeEach(async () => {
    hermetic = await startHermeticServer();
  });

  afterEach(async () => {
    await hermetic.shutdown();
  });

  it('creates root box', async () => {
    const user = await generateUser();
    const home = await generateHome({ ownerId: user._id });
    const resp = await createBoxHandler(
      {
        homeId: home._id,
        name: 'my box',
      },
      { req: fakeReq({ session: { userId: user._id } }) }
    );

    expect(resp.id).toBeTruthy();
    const newBox = await Box.findOne({ _id: resp.id });
    expect(newBox.parentId).toBeFalsy();
    expect(newBox.homeId).toBe(home._id);
    expect(newBox.name).toBe('my box');
  });

  it('creates box with parentId', async () => {
    const user = await generateUser();
    const home = await generateHome({ ownerId: user._id });
    const parentBox = await generateBox({
      homeId: home._id,
    });
    const resp = await createBoxHandler(
      {
        homeId: home._id,
        name: 'my box',
        parentId: parentBox._id,
      },
      { req: fakeReq({ session: { userId: user._id } }) }
    );

    expect(resp.id).toBeTruthy();
    const newBox = await Box.findOne({ _id: resp.id });
    expect(newBox.parentId).toBe(parentBox._id);
    expect(newBox.homeId).toBe(home._id);
    expect(newBox.name).toBe('my box');
  });

  it('fails if user not logged in', async () => {
    const user = await generateUser();
    const home = await generateHome({ ownerId: user._id });
    expect.assertions(1);
    try {
      await createBoxHandler(
        {
          homeId: home._id,
          name: 'my box',
        },
        { req: fakeReq({ session: { userId: null } }) }
      );
    } catch (e) {
      expect(e.message).toBe(`You are not logged in.`);
    }
  });

  it('fails if name not provided', async () => {
    const user = await generateUser();
    const home = await generateHome({ ownerId: user._id });
    expect.assertions(1);
    try {
      await createBoxHandler(
        // @ts-expect-error For testing, force unset required parameter.
        {
          homeId: home._id,
        },
        { req: fakeReq({ session: { userId: user._id } }) }
      );
    } catch (e) {
      expect(e.message).toBe(`You must provide a name.`);
    }
  });

  it('fails if homeId not provided', async () => {
    const user = await generateUser();
    expect.assertions(1);
    try {
      await createBoxHandler(
        // @ts-expect-error For testing, force unset required parameter.
        {
          name: 'my name',
        },
        { req: fakeReq({ session: { userId: user._id } }) }
      );
    } catch (e) {
      expect(e.message).toBe(`You must provide a homeId.`);
    }
  });

  it('fails if not home owner', async () => {
    const user = await generateUser();
    const user2 = await generateUser({ email: 'test2@test.com' });
    const home = await generateHome({ ownerId: user2._id });
    try {
      await createBoxHandler(
        {
          homeId: home._id,
          name: 'my box',
        },
        { req: fakeReq({ session: { userId: user._id } }) }
      );
    } catch (e) {
      expect(e.message).toBe(`Home with ID '${home._id}' cannot be found.`);
    }
  });

  it('fails if home not found', async () => {
    const user = await generateUser();
    try {
      await createBoxHandler(
        {
          homeId: 'invalid_id',
          name: 'my box',
        },
        { req: fakeReq({ session: { userId: user._id } }) }
      );
    } catch (e) {
      expect(e.message).toBe(`Home with ID 'invalid_id' cannot be found.`);
    }
  });
});
