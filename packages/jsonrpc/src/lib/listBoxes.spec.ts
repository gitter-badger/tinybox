import { HermeticServer, startHermeticServer } from '../testing/utils/hermetic';

import { fakeReq } from '../testing/utils/fakeReq';
import { generateBox } from '../testing/utils/generators/generateBox';
import { generateHome } from '../testing/utils/generators/generateHome';
import { generateUser } from '../testing/utils/generators/generateUser';
import { listBoxesHandler } from './listBoxes';

describe('getHome', () => {
  let hermetic: HermeticServer;

  beforeEach(async () => {
    hermetic = await startHermeticServer();
  });

  afterEach(async () => {
    await hermetic.shutdown();
  });

  it('lists all root boxes', async () => {
    const user = await generateUser();
    const home = await generateHome({ ownerId: user._id });
    const box1 = await generateBox({ name: 'test', homeId: home._id });
    const box2 = await generateBox({ name: 'test', homeId: home._id });
    const box3 = await generateBox({
      name: 'test',
      parentId: box2._id,
      homeId: home._id,
    });
    const resp = await listBoxesHandler(
      {
        homeId: home._id,
      },
      { req: fakeReq({ session: { userId: user._id } }) }
    );

    expect(resp.boxes).toBeTruthy();
    expect(resp.boxes.length).toBe(2);
    expect(resp.boxes[0].id).toBe(box1._id);
    expect(resp.boxes[1].id).toBe(box2._id);
  });

  it('lists all child boxes', async () => {
    const user = await generateUser();
    const home = await generateHome({ ownerId: user._id });
    const box1 = await generateBox({ name: 'test', homeId: home._id });
    const box2 = await generateBox({ name: 'test', homeId: home._id });
    const box3 = await generateBox({
      name: 'test',
      parentId: box2._id,
      homeId: home._id,
    });
    const resp = await listBoxesHandler(
      {
        homeId: home._id,
        parentId: box2._id,
      },
      { req: fakeReq({ session: { userId: user._id } }) }
    );

    expect(resp.boxes).toBeTruthy();
    expect(resp.boxes.length).toBe(1);
    expect(resp.boxes[0].id).toBe(box3._id);
  });

  it('fails if not owner of home', async () => {
    const user = await generateUser();
    const user2 = await generateUser({ email: 'test2@test.com' });
    const home = await generateHome({ ownerId: user._id });
    const box1 = await generateBox({ name: 'test', homeId: home._id });
    const box2 = await generateBox({ name: 'test', homeId: home._id });

    try {
      await listBoxesHandler(
        {
          homeId: home._id,
        },
        { req: fakeReq({ session: { userId: user2._id } }) }
      );
    } catch (e) {
      expect(e.message).toBe(
        `Home with ID '${home._id}' cannot be found, make sure you have access to it.`
      );
    }
  });

  it('fails if not logged in', async () => {
    expect.assertions(1);
    try {
      await listBoxesHandler(
        {
          homeId: 'invalid_id',
        },
        { req: fakeReq({ session: { userId: null } }) }
      );
    } catch (e) {
      expect(e.message).toBe(`You are not logged in.`);
    }
  });
});
