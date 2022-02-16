import { HermeticServer, startHermeticServer } from '../testing/utils/hermetic';

import { Item } from '@tinybox/models';
import { fakeReq } from '../testing/utils/fakeReq';
import { generateBox } from '../testing/utils/generators/generateBox';
import { generateHome } from '../testing/utils/generators/generateHome';
import { generateItem } from '../testing/utils/generators/generateItem';
import { generateUser } from '../testing/utils/generators/generateUser';
import { updateItemHandler } from './updateItem';

describe('updateItem', () => {
  let hermetic: HermeticServer;

  beforeEach(async () => {
    hermetic = await startHermeticServer();
  });

  afterEach(async () => {
    await hermetic.shutdown();
  });

  it('updates item', async () => {
    const user = await generateUser();
    const home = await generateHome({ ownerId: user._id });
    const box = await generateBox({ homeId: home._id });
    const box2 = await generateBox({ homeId: home._id });
    const item = await generateItem({
      homeId: home._id,
      boxId: box._id,
      name: 'name',
      quantity: 1,
    });
    const resp = await updateItemHandler(
      {
        homeId: home._id,
        boxId: box._id,
        itemId: item._id,
        item: {
          name: 'another name',
          quantity: 123,
          boxId: box2._id,
        },
      },
      { req: fakeReq({ session: { userId: user._id } }) }
    );

    expect(resp.id).toBe(item._id);
    const newItem = await Item.findOne({ _id: item._id });
    expect(newItem.name).toBe('another name');
    expect(newItem.quantity).toBe(123);
    expect(newItem.boxId).toBe(box2._id);
  });
});
