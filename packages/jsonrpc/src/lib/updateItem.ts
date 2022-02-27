import { Box, Home, IBox, IHome, IItem, Item } from '@tinybox/models';

import { JSONRPCServerParams } from './types';
import { assertNonNull } from '@tinybox/assertion';

export type UpdateItemParams = {
  homeId: string;
  boxId: string;
  itemId: string;
  item: UpdateItemParamsItem;
};

export type UpdateItemParamsItem = {
  name: string;
  quantity: number;
  boxId: string;
};

export type UpdateItemResult = {
  id: string;
};

export async function updateItemHandler(
  params: UpdateItemParams,
  { req }: JSONRPCServerParams
): Promise<UpdateItemResult> {
  assertNonNull(req['session']['userId'], 'You are not logged in.');
  assertNonNull(params?.homeId, 'You must provide a homeId.');
  assertNonNull(params?.boxId, 'You must provide a boxId.');
  assertNonNull(params?.itemId, 'You must provide an itemId.');
  assertNonNull(params?.item, `'item' is a required parameter.`);
  assertNonNull(params?.item?.name, `'item.name' is a required parameter.`);
  assertNonNull(
    params?.item?.quantity,
    `'item.quantity' is a required parameter.`
  );
  assertNonNull(params?.item?.boxId, `'item.boxId' is a required parameter.`);

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

  const newBox: IBox = await Box.findOne({
    _id: params.item.boxId,
    homeId: home._id,
  });
  assertNonNull(newBox, `Box with ID '${params.item.boxId}' cannot be found.`);

  item.name = params.item.name;
  item.quantity = params.item.quantity;
  item.boxId = params.item.boxId;
  await item.save();

  return {
    id: item._id,
  };
}
