import { HermeticServer, startHermeticServer } from '../testing/utils/hermetic';

import { Home } from '@tinybox/models';
import { createHomeHandler } from './createHome';
import { fakeReq } from '../testing/utils/fakeReq';
import { generateUser } from '../testing/utils/generators/generateUser';

describe('createHome', () => {
  let hermetic: HermeticServer;

  beforeEach(async () => {
    hermetic = await startHermeticServer();
  });

  afterEach(async () => {
    await hermetic.shutdown();
  });

  it('creates home', async () => {
    const user = await generateUser();
    const resp = await createHomeHandler(
      {
        name: 'hello',
      },
      { req: fakeReq({ session: { userId: user._id } }) }
    );

    expect(resp.id).toBeTruthy();
    const home = await Home.findOne({ id: resp.id });
    expect(home).toBeTruthy();
    expect(home.name).toBe('hello');
    expect(home.ownerId).toBe(user._id);
  });

  it('errors if no name provided', async () => {
    expect.assertions(1);
    const user = await generateUser();
    try {
      await createHomeHandler(
        {
          name: null,
        },
        { req: fakeReq({ session: { userId: user._id } }) }
      );
    } catch (e) {
      expect(e.message).toBe('You must provide a name.');
    }
  });

  it('errors if name is empty string', async () => {
    expect.assertions(1);
    const user = await generateUser();
    try {
      await createHomeHandler(
        {
          name: '',
        },
        { req: fakeReq({ session: { userId: user._id } }) }
      );
    } catch (e) {
      expect(e.message).toBe('You must provide a name.');
    }
  });

  it('errors if not logged in', async () => {
    expect.assertions(1);
    try {
      await createHomeHandler(
        {
          name: 'my home',
        },
        { req: fakeReq() }
      );
    } catch (e) {
      expect(e.message).toBe('You are not logged in.');
    }
  });
});
