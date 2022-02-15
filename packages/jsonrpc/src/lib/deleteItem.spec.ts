import { HermeticServer, startHermeticServer } from '../testing/utils/hermetic';

import { Item } from '@tinybox/models';
import { deleteItemHandler } from './deleteItem';
import { fakeReq } from '../testing/utils/fakeReq';
import { generateBox } from '../testing/utils/generators/generateBox';
import { generateHome } from '../testing/utils/generators/generateHome';
import { generateItem } from '../testing/utils/generators/generateItem';
import { generateUser } from '../testing/utils/generators/generateUser';

describe('deleteItem', () => {
  let hermetic: HermeticServer;

  beforeEach(async () => {
    hermetic = await startHermeticServer();
  });

  afterEach(async () => {
    await hermetic.shutdown();
  });

  it('deletes item', async () => {
    const user = await generateUser();
    const home = await generateHome({ ownerId: user._id });
    const box = await generateBox({ homeId: home._id });
    const item = await generateItem({ homeId: home._id, boxId: box._id });
    const resp = await deleteItemHandler(
      {
        homeId: home._id,
        boxId: box._id,
        itemId: item._id,
      },
      { req: fakeReq({ session: { userId: user._id } }) }
    );

    expect(resp.id).toBeTruthy();
    const newItem = await Item.findOne({ _id: resp.id });
    expect(newItem).toBeFalsy();
  });
});
