import { Box, Home, Item } from '@tinybox/models';

import { JSONRPCServerParams } from './types';
import { assertNonNull } from '@tinybox/assertion';

export type DeleteItemParams = {
  homeId: string;
  boxId: string;
  itemId: string;
};

export type DeleteItemResult = {
  id: string;
};

export async function deleteItemHandler(
  params: DeleteItemParams,
  { req }: JSONRPCServerParams
): Promise<DeleteItemResult> {
  assertNonNull(req['session']['userId'], 'You are not logged in.');
  assertNonNull(params?.homeId, 'You must provide a homeId.');
  assertNonNull(params?.boxId, 'You must provide a boxId.');
  assertNonNull(params?.itemId, 'You must provide an itemId.');

  const home = await Home.findOne({
    ownerId: req['session']['userId'],
    _id: params.homeId,
  });
  assertNonNull(home, `Home with ID '${params.homeId}' cannot be found.`);

  const box = await Box.findOne({
    _id: params.boxId,
    homeId: home._id,
  });
  assertNonNull(box, `Box with ID '${params.boxId}' cannot be found.`);

  const item = await Item.findOne({
    _id: params.itemId,
    boxId: box._id,
  });
  assertNonNull(item, `Item with ID '${params.itemId}' cannot be found.`);

  await item.delete();

  return {
    id: item._id,
  };
}
