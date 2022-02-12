import { Box, Home } from '@tinybox/models';

import { JSONRPCServerParams } from './types';
import { assertNonNull } from '@tinybox/assertion';

export type UpdateBoxParams = {
  homeId: string;
  boxId: string;
  box: UpdateBoxParamsBox;
};

export type UpdateBoxParamsBox = {
  name: string;
  parentId?: string;
};

export type UpdateBoxResult = {
  id: string;
};

export async function updateBoxHandler(
  params: UpdateBoxParams,
  { req }: JSONRPCServerParams
): Promise<UpdateBoxResult> {
  assertNonNull(req['session']['userId'], 'You are not logged in.');
  assertNonNull(params?.homeId, `'homeId' is a required parameter.`);
  assertNonNull(params?.boxId, `'boxId' is a required parameter.`);
  assertNonNull(params?.box, `'box' is a required parameter.`);
  assertNonNull(params?.box?.name, `'box.name' is a required parameter.`);

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

  box.name = params.box.name;

  if (params.box.parentId) {
    const parentBox = await Box.findOne({
      _id: params.box.parentId,
      homeId: home._id,
    });
    assertNonNull(
      parentBox,
      `Box with ID '${params.box.parentId}' cannot be found.`
    );
  }
  box.parentId = params.box.parentId;

  await box.save();

  return {
    id: box._id,
  };
}
