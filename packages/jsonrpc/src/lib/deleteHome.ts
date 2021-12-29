import { Home } from '@tinybox/models';
import { JSONRPCServerParams } from './types';
import { assertNonNull } from '@tinybox/assertion';

export type DeleteHomeParams = {
  id: string;
};

export type DeleteHomeResult = {
  id: string;
};

export async function deleteHomeHandler(
  params: DeleteHomeParams,
  { req }: JSONRPCServerParams
): Promise<DeleteHomeResult> {
  assertNonNull(req['session']['userId'], 'You are not logged in.');
  assertNonNull(params?.id, `'id' is a required parameter.`);

  const userId = req['session']['userId'];
  const home = await Home.findOne({ ownerId: userId, _id: params.id });

  assertNonNull(
    home,
    `Home with ID '${params.id}' cannot be found, make sure you have access to it.`
  );

  await home.delete();

  return {
    id: home._id,
  };
}
