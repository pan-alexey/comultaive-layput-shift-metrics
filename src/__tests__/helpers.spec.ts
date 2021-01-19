import { sleep, awaitTimeout } from '../helpers';

describe('helpers', () => {
  it('sleep', async () => {
    const ms = 1000;
    const timeStart = Number(new Date());
    await sleep(ms);
    const endTime = Number(new Date());
    expect(endTime - timeStart >= ms).toBe(true);
  });



  it('awaitTimeout: result', async () => {
    const ms = 1000;
    const { result, error } = await awaitTimeout(sleep(ms, 'ok'), ms*2);
    expect(result).toBe('ok');
    expect(error).toBe(null);
  });

  it('awaitTimeout: error', async () => {
    const ms = 1000;
    const { result, error } = await awaitTimeout(sleep(ms, 'ok'), ms/2);
    expect(result).toBe(null);
    expect(error).toMatch('Timeout');
  });
});