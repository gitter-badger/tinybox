import { Home } from '@tinybox/models';

export async function generateHome({
  name = 'my home',
  ownerId,
}: {
  name?: string;
  ownerId: string;
}) {
  const home = new Home({
    name,
    ownerId,
  });
  await home.save();
  return home;
}
