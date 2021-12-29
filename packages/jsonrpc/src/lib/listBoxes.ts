import { Box, Home } from '@tinybox/models';

import { JSONRPCServerParams } from './types';
import { assertNonNull } from '@tinybox/assertion';

export type ListBoxesParams = {
  homeId: string;
  parentId?: string;
};

export type ListBoxesResult = {
  boxes: ListBoxesBox[];
};

export type ListBoxesBox = {
  id: string;
  name: string;
  parentId?: string;
  homeId: string;
};

export async function listBoxesHandler(
  params: ListBoxesParams,
  { req }: JSONRPCServerParams
): Promise<ListBoxesResult> {
  assertNonNull(req['session']['userId'], 'You are not logged in.');
  assertNonNull(params?.homeId, `'homeId' is a required parameter.`);

  const userId = req['session']['userId'];
  const home = await Home.findOne({ ownerId: userId, _id: params.homeId });
  assertNonNull(
    home,
    `Home with ID '${params.homeId}' cannot be found, make sure you have access to it.`
  );
  const boxes = await Box.find({
    homeId: params.homeId,
    parentId: params.parentId,
  });

  return {
    boxes: boxes.map((b) => {
      return {
        id: b.id,
        name: b.name,
        parentId: b.parentId,
        homeId: b.homeId,
      };
    }),
  };
}
