import { JSONRPCServerParams } from './types';

export type CreateContainerParams = {
  parentId?: string;
  homeId: string;
  name: string;
};

export type CreateContainerResult = {
  id: string;
};

export async function createHomeHandler(
  params: CreateContainerParams,
  { req }: JSONRPCServerParams
): Promise<CreateContainerResult> {
  return {
    id: 'test_id',
  };
}
