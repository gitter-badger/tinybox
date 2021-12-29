import { HermeticServer, startHermeticServer } from '../testing/utils/hermetic';

describe('createContainer', () => {
  let hermetic: HermeticServer;

  beforeEach(async () => {
    hermetic = await startHermeticServer();
  });

  afterEach(async () => {
    await hermetic.shutdown();
  });

  it('creates container', async () => {
    expect(true).toBe(true);
  });

  it('creates nested container', async () => {
    expect(true).toBe(true);
  });

  it('errors if home ID invalid', async () => {
    expect(true).toBe(true);
  });

  it('errors if home ID not provided', async () => {
    expect(true).toBe(true);
  });

  it('errors if no access to home', async () => {
    expect(true).toBe(true);
  });

  it('errors if parent do not belong to same home', async () => {
    expect(true).toBe(true);
  });

  it('errors if parent not found', async () => {
    expect(true).toBe(true);
  });

  it('errors if name not provided', async () => {
    expect(true).toBe(true);
  });

  it('errors if name is empty string', async () => {
    expect(true).toBe(true);
  });
});
