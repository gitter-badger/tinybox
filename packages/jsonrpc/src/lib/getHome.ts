import { Home } from '@tinybox/models';
import { JSONRPCServerParams } from './types';
import { assertNonNull } from '@tinybox/assertion';

export type GetHomeParams = {
  id: string;
};

export type GetHomeResult = {
  home: GetHomeHome;
};

export type GetHomeHome = {
  id: string;
  name: string;
  ownerId: string;
};

export async function getHomeHandler(
  params: GetHomeParams,
  { req }: JSONRPCServerParams
): Promise<GetHomeResult> {
  assertNonNull(req['session']['userId'], 'You are not logged in.');
  assertNonNull(params?.id, `'id' is a required parameter.`);

  const userId = req['session']['userId'];
  const home = await Home.findOne({ ownerId: userId, _id: params.id });

  assertNonNull(
    home,
    `Home with ID '${params.id}' cannot be found, make sure you have access to it.`
  );

  return {
    home: {
      id: home.id,
      name: home.name,
      ownerId: home.ownerId,
    },
  };
}
