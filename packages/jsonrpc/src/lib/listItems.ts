import { Box, Home, IBox, IHome, IItem, Item } from '@tinybox/models';

import { JSONRPCServerParams } from './types';
import { assertNonNull } from '@tinybox/assertion';

export type ListItemsParams = {
  homeId: string;
  boxId: string;
};

export type ListItemsResult = {
  items: ListItemsItem[];
};

export type ListItemsItem = {
  id: string;
  name: string;
  quantity: number;
  homeId: string;
  boxId: string;
};

export async function listItemHandler(
  params: ListItemsParams,
  { req }: JSONRPCServerParams
): Promise<ListItemsResult> {
  assertNonNull(req['session']['userId'], 'You are not logged in.');
  assertNonNull(params?.homeId, 'You must provide a homeId.');
  assertNonNull(params?.boxId, 'You must provide a boxId.');

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

  const items: IItem[] = await Item.find({
    boxId: box._id,
  });

  return {
    items: items.map((item) => {
      return {
        id: item._id,
        name: item.name,
        quantity: item.quantity,
        homeId: item.homeId,
        boxId: item.boxId,
      };
    }),
  };
}
