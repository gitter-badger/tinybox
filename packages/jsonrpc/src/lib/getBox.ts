import { Box, Home } from '@tinybox/models';

import { JSONRPCServerParams } from './types';
import { assertNonNull } from '@tinybox/assertion';

export type GetBoxParams = {
  homeId: string;
  boxId: string;
};

export type GetBoxResult = {
  box: GetBoxBox;
  /**
   * A list of boxes that is in this box's parent chain.
   */
  parentChain: GetBoxBox[];
};

export type GetBoxBox = {
  id: string;
  name: string;
  parentId?: string;
  homeId: string;
};

export async function getBoxHandler(
  params: GetBoxParams,
  { req }: JSONRPCServerParams
): Promise<GetBoxResult> {
  assertNonNull(req['session']['userId'], 'You are not logged in.');
  assertNonNull(params?.homeId, `'homeId' is a required parameter.`);
  assertNonNull(params?.boxId, `'boxId' is a required parameter.`);

  const userId = req['session']['userId'];
  const home = await Home.findOne({ ownerId: userId, _id: params.homeId });
  assertNonNull(
    home,
    `Home with ID '${params.homeId}' cannot be found, make sure you have access to it.`
  );
  const box = await Box.findOne({ homeId: params.homeId, _id: params.boxId });
  assertNonNull(
    box,
    `Box with ID '${params.boxId}' cannot be found, make sure you have access to it.`
  );

  const parents = [];
  let nextId = box.parentId;
  while (nextId) {
    const parent = await Box.findOne({ _id: nextId });
    parents.push(parent);
    nextId = parent.parentId;
  }

  return {
    box: {
      id: box.id,
      name: box.name,
      parentId: box.parentId,
      homeId: box.homeId,
    },
    parentChain: parents.map((p) => {
      return {
        id: p.id,
        name: p.name,
        parentId: p.parentId,
        homeId: p.homeId,
      };
    }),
  };
}
