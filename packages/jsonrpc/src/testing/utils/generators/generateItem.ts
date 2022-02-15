import { Item } from '@tinybox/models';

export async function generateItem({
  name = 'my item',
  quantity = 1,
  homeId,
  boxId,
}: {
  name?: string;
  quantity?: number;
  homeId: string;
  boxId: string;
}) {
  const item = new Item({
    name,
    quantity,
    homeId,
    boxId,
  });
  await item.save();
  return item;
}
