import { HermeticServer, startHermeticServer } from '../testing/utils/hermetic';

import { Item } from '@tinybox/models';
import { fakeReq } from '../testing/utils/fakeReq';
import { generateBox } from '../testing/utils/generators/generateBox';
import { generateHome } from '../testing/utils/generators/generateHome';
import { generateItem } from '../testing/utils/generators/generateItem';
import { generateUser } from '../testing/utils/generators/generateUser';
import { getItemHandler } from './getItem';

describe('getItem', () => {
  let hermetic: HermeticServer;

  beforeEach(async () => {
    hermetic = await startHermeticServer();
  });

  afterEach(async () => {
    await hermetic.shutdown();
  });

  it('gets item', async () => {
    const user = await generateUser();
    const home = await generateHome({ ownerId: user._id });
    const box = await generateBox({ homeId: home._id });
    const item = await generateItem({ homeId: home._id, boxId: box._id });
    const resp = await getItemHandler(
      {
        homeId: home._id,
        boxId: box._id,
        itemId: item._id,
      },
      { req: fakeReq({ session: { userId: user._id } }) }
    );

    expect(resp.item.id).toBe(item._id);
    expect(resp.item.name).toBe(item.name);
    expect(resp.item.homeId).toBe(item.homeId);
    expect(resp.item.boxId).toBe(item.boxId);
    expect(resp.item.quantity).toBe(item.quantity);
  });
});
