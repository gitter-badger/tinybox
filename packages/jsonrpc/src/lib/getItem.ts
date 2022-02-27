import { Box, Home, IBox, IHome, IItem, Item } from '@tinybox/models';

import { JSONRPCServerParams } from './types';
import { assertNonNull } from '@tinybox/assertion';

export type GetItemParams = {
  homeId: string;
  boxId: string;
  itemId: string;
};

export type GetItemResult = {
  item: GetItemItem;
};

export type GetItemItem = {
  id: string;
  name: string;
  quantity: number;
  homeId: string;
  boxId: string;
};

export async function getItemHandler(
  params: GetItemParams,
  { req }: JSONRPCServerParams
): Promise<GetItemResult> {
  assertNonNull(req['session']['userId'], 'You are not logged in.');
  assertNonNull(params?.homeId, 'You must provide a homeId.');
  assertNonNull(params?.boxId, 'You must provide a boxId.');
  assertNonNull(params?.itemId, 'You must provide an itemId.');

  const home: IHome = await Home.findOne({
    ownerId: req['session']['userId'],
    _id: params.homeId,
  });
  assertNonNull(home, `Home with ID '${params.homeId}' cannot be found.`);

  const box: IBox = await Box.findOne({
    _id: params.boxId,
    homeId: home._id,
  });
  assertNonNull(box, `Box with ID '${params.boxId}' cannot be found.`);

  const item: IItem = await Item.findOne({
    _id: params.itemId,
    boxId: box._id,
  });
  assertNonNull(item, `Item with ID '${params.itemId}' cannot be found.`);

  return {
    item: {
      id: item._id,
      name: item.name,
      quantity: item.quantity,
      homeId: item.homeId,
      boxId: item.boxId,
    },
  };
}
