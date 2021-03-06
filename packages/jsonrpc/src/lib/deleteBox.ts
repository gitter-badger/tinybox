import { Box, Home } from '@tinybox/models';

import { JSONRPCServerParams } from './types';
import { assertNonNull } from '@tinybox/assertion';

export type DeleteBoxParams = {
  homeId: string;
  boxId: string;
};

export type DeleteBoxResult = {
  id: string;
};

export async function deleteBoxHandler(
  params: DeleteBoxParams,
  { req }: JSONRPCServerParams
): Promise<DeleteBoxResult> {
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

  await box.delete();

  return {
    id: box._id,
  };
}
