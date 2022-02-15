import { HermeticServer, startHermeticServer } from '../testing/utils/hermetic';

import { fakeReq } from '../testing/utils/fakeReq';
import { generateBox } from '../testing/utils/generators/generateBox';
import { generateHome } from '../testing/utils/generators/generateHome';
import { generateItem } from '../testing/utils/generators/generateItem';
import { generateUser } from '../testing/utils/generators/generateUser';
import { listItemHandler } from './listItems';

describe('getItem', () => {
  let hermetic: HermeticServer;

  beforeEach(async () => {
    hermetic = await startHermeticServer();
  });

  afterEach(async () => {
    await hermetic.shutdown();
  });

  it('lists item', async () => {
    const user = await generateUser();
    const home = await generateHome({ ownerId: user._id });
    const box = await generateBox({ homeId: home._id });
    const item = await generateItem({ homeId: home._id, boxId: box._id });
    const item2 = await generateItem({ homeId: home._id, boxId: box._id });
    const resp = await listItemHandler(
      {
        homeId: home._id,
        boxId: box._id,
      },
      { req: fakeReq({ session: { userId: user._id } }) }
    );

    expect(resp.items.length).toBe(2);
    expect(resp.items[0].id).toBe(item._id);
    expect(resp.items[1].id).toBe(item2._id);
  });
});
