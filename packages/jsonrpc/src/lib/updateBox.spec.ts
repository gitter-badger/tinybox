import { HermeticServer, startHermeticServer } from '../testing/utils/hermetic';

import { Box } from '@tinybox/models';
import { fakeReq } from '../testing/utils/fakeReq';
import { generateBox } from '../testing/utils/generators/generateBox';
import { generateHome } from '../testing/utils/generators/generateHome';
import { generateUser } from '../testing/utils/generators/generateUser';
import { updateBoxHandler } from './updateBox';

describe('updateHome', () => {
  let hermetic: HermeticServer;

  beforeEach(async () => {
    hermetic = await startHermeticServer();
  });

  afterEach(async () => {
    await hermetic.shutdown();
  });

  it('updates box name', async () => {
    const user = await generateUser();
    const home = await generateHome({ ownerId: user._id });
    const box = await generateBox({ name: 'test', homeId: home._id });
    const resp = await updateBoxHandler(
      {
        homeId: home._id,
        boxId: box._id,
        box: {
          name: 'another name',
        },
      },
      { req: fakeReq({ session: { userId: user._id } }) }
    );

    expect(resp.id).toBe(box._id);
    const newBox = await Box.findOne({ _id: box._id });
    expect(newBox.name).toBe('another name');
  });

  it('updates box name and parentId', async () => {
    const user = await generateUser();
    const home = await generateHome({ ownerId: user._id });
    const box = await generateBox({ name: 'test', homeId: home._id });
    const box2 = await generateBox({ name: 'test', homeId: home._id });
    const resp = await updateBoxHandler(
      {
        homeId: home._id,
        boxId: box2._id,
        box: {
          parentId: box._id,
          name: 'another name',
        },
      },
      { req: fakeReq({ session: { userId: user._id } }) }
    );

    expect(resp.id).toBe(box2._id);
    const newBox = await Box.findOne({ _id: box2._id });
    expect(newBox.name).toBe('another name');
    expect(newBox.parentId).toBe(box._id);
  });

  it('un-sets parentId', async () => {
    const user = await generateUser();
    const home = await generateHome({ ownerId: user._id });
    const box = await generateBox({ name: 'test', homeId: home._id });
    const box2 = await generateBox({
      name: 'test',
      homeId: home._id,
      parentId: box._id,
    });
    const resp = await updateBoxHandler(
      {
        homeId: home._id,
        boxId: box2._id,
        box: {
          name: 'another name',
        },
      },
      { req: fakeReq({ session: { userId: user._id } }) }
    );

    expect(resp.id).toBe(box2._id);
    const newBox = await Box.findOne({ _id: box2._id });
    expect(newBox.name).toBe('another name');
    expect(newBox.parentId).toBeFalsy();
  });

  it('errors if no access to home', async () => {
    const user = await generateUser();
    const user2 = await generateUser({ email: 'test2@test.com' });
    const home = await generateHome({ ownerId: user._id });
    const box = await generateBox({ name: 'test', homeId: home._id });
    const box2 = await generateBox({
      name: 'test',
      homeId: home._id,
      parentId: box._id,
    });
    expect.assertions(1);
    try {
      await updateBoxHandler(
        {
          homeId: home._id,
          boxId: box2._id,
          box: {
            name: 'another name',
          },
        },
        { req: fakeReq({ session: { userId: user2._id } }) }
      );
    } catch (e) {
      expect(e.message).toBe(
        `Home with ID '${home._id}' cannot be found, make sure you have access to it.`
      );
    }
  });

  it('errors if parent home does not match', async () => {
    const user = await generateUser();
    const home = await generateHome({ ownerId: user._id });
    const home2 = await generateHome({ ownerId: user._id });
    const box = await generateBox({ name: 'test', homeId: home._id });
    const box2 = await generateBox({
      name: 'test',
      homeId: home2._id,
    });
    expect.assertions(1);
    try {
      await updateBoxHandler(
        {
          homeId: home2._id,
          boxId: box2._id,
          box: {
            name: 'another name',
            parentId: box._id,
          },
        },
        { req: fakeReq({ session: { userId: user._id } }) }
      );
    } catch (e) {
      expect(e.message).toBe(`Box with ID '${box._id}' cannot be found.`);
    }
  });

  it('errors if not authenticated', async () => {
    const user = await generateUser();
    const home = await generateHome({ ownerId: user._id });
    const home2 = await generateHome({ ownerId: user._id });
    const box = await generateBox({ name: 'test', homeId: home._id });
    const box2 = await generateBox({
      name: 'test',
      homeId: home2._id,
    });
    expect.assertions(1);
    try {
      await updateBoxHandler(
        {
          homeId: home2._id,
          boxId: box2._id,
          box: {
            name: 'another name',
            parentId: box._id,
          },
        },
        { req: fakeReq({ session: { userId: null } }) }
      );
    } catch (e) {
      expect(e.message).toBe(`You are not logged in.`);
    }
  });
});
