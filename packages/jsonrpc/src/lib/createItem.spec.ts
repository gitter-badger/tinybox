import { HermeticServer, startHermeticServer } from '../testing/utils/hermetic';

import { Item } from '@tinybox/models';
import { createItemHandler } from './createItem';
import { fakeReq } from '../testing/utils/fakeReq';
import { generateBox } from '../testing/utils/generators/generateBox';
import { generateHome } from '../testing/utils/generators/generateHome';
import { generateUser } from '../testing/utils/generators/generateUser';

describe('createItem', () => {
  let hermetic: HermeticServer;

  beforeEach(async () => {
    hermetic = await startHermeticServer();
  });

  afterEach(async () => {
    await hermetic.shutdown();
  });

  it('creates item', async () => {
    const user = await generateUser();
    const home = await generateHome({ ownerId: user._id });
    const box = await generateBox({ homeId: home._id });
    const resp = await createItemHandler(
      {
        homeId: home._id,
        boxId: box._id,
        name: 'my item',
        quantity: 1,
      },
      { req: fakeReq({ session: { userId: user._id } }) }
    );

    expect(resp.id).toBeTruthy();
    const newItem = await Item.findOne({ _id: resp.id });
    expect(newItem.boxId).toBe(box._id);
    expect(newItem.homeId).toBe(home._id);
    expect(newItem.name).toBe('my item');
    expect(newItem.quantity).toBe(1);
  });
});
