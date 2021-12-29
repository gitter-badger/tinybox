import { Home } from '@tinybox/models';
import { JSONRPCServerParams } from './types';
import { assertNonNull } from '@tinybox/assertion';

export type ListHomesParams = unknown;

export type ListHomesResult = {
  homes: ListHomesHome[];
};

export type ListHomesHome = {
  id: string;
  name: string;
  ownerId: string;
};

export async function listHomesHandler(
  params: ListHomesParams,
  { req }: JSONRPCServerParams
): Promise<ListHomesResult> {
  assertNonNull(req['session']['userId'], 'You are not logged in.');

  const homes = await Home.find({ ownerId: req['session']['userId'] });

  return {
    homes: homes.map((h) => {
      return {
        id: h._id,
        name: h.name,
        ownerId: h.ownerId,
      };
    }),
  };
}
