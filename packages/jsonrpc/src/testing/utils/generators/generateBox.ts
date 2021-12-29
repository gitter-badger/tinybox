import { Box } from '@tinybox/models';

export async function generateBox({
  name = 'my box',
  homeId,
  parentId,
}: {
  name?: string;
  homeId: string;
  parentId?: string;
}) {
  const box = new Box({
    name,
    homeId,
    parentId,
  });
  await box.save();
  return box;
}
