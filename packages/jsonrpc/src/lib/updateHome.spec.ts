import { HermeticServer, startHermeticServer } from '../testing/utils/hermetic';

import { Home } from '@tinybox/models';
import { fakeReq } from '../testing/utils/fakeReq';
import { generateHome } from '../testing/utils/generators/generateHome';
import { generateUser } from '../testing/utils/generators/generateUser';
import { updateHomeHandler } from './updateHome';

describe('updateHome', () => {
  let hermetic: HermeticServer;

  beforeEach(async () => {
    hermetic = await startHermeticServer();
  });

  afterEach(async () => {
    await hermetic.shutdown();
  });

  it('updates home name', async () => {
    const user = await generateUser();
    const home = await generateHome({
      name: 'initial name',
      ownerId: user._id,
    });
    const resp = await updateHomeHandler(
      {
        id: home._id,
        name: 'test name',
      },
      { req: fakeReq({ session: { userId: user._id } }) }
    );

    const newHome = await Home.findOne({ _id: home._id });
    expect(resp.id).toBe(home._id);
    expect(newHome.name).toBe('test name');
  });

  it('does not replace name if null', async () => {
    const user = await generateUser();
    const home = await generateHome({
      name: 'initial name',
      ownerId: user._id,
    });
    const resp = await updateHomeHandler(
      {
        id: home._id,
      },
      { req: fakeReq({ session: { userId: user._id } }) }
    );

    const newHome = await Home.findOne({ _id: home._id });
    expect(resp.id).toBe(home._id);
    expect(newHome.name).toBe('initial name');
  });

  it('errors if home not found', async () => {
    const user = await generateUser();
    expect.assertions(1);
    try {
      await updateHomeHandler(
        {
          id: 'fake_id',
        },
        { req: fakeReq({ session: { userId: user._id } }) }
      );
    } catch (e) {
      expect(e.message).toBe(
        `Home with ID 'fake_id' cannot be found, make sure you have access to it.`
      );
    }
  });

  it('errors if not owner', async () => {
    const user = await generateUser();
    const user2 = await generateUser({ email: 'test2@test.com' });
    const home = await generateHome({
      name: 'initial name',
      ownerId: user2._id,
    });
    expect.assertions(1);
    try {
      await updateHomeHandler(
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

  it('errors if user not logged in', async () => {
    expect.assertions(1);
    try {
      await updateHomeHandler(
        {
          id: 'test_id',
        },
        { req: fakeReq({ session: { userId: null } }) }
      );
    } catch (e) {
      expect(e.message).toBe(`You are not logged in.`);
    }
  });
});
