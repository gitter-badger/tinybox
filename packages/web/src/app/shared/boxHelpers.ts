import { rpc } from '../api';

/**
 * Get all parent IDs for a box. The last item will be boxId, second last will
 * be the parent ID, and third last will be parent's parent ID etc.
 */
export async function getParents(
  homeId: string,
  boxId: string
): Promise<string[]> {
  const parentIds = [];
  let nextId = boxId;
  let depth = 0;
  while (nextId) {
    const result = await rpc('getBox', { homeId, boxId: nextId });
    parentIds.push(nextId);
    nextId = result.box.parentId;
    depth++;
    if (depth > 10) break;
  }
  return parentIds.reverse();
}
