import { describe, it, expect } from 'vitest';
import { eurCentsToMoney, BGN_PER_EUR } from './money';

describe('eurCentsToMoney', () => {
  it('keeps the euro cents and formats euros with a comma decimal', () => {
    const m = eurCentsToMoney(5899);
    expect(m.eurCents).toBe(5899);
    expect(m.eurFormatted).toBe('58,99 €');
  });

  it('derives BGN at the fixed peg and formats it', () => {
    const m = eurCentsToMoney(5899);
    expect(m.bgnCents).toBe(Math.round(5899 * BGN_PER_EUR));
    expect(m.bgnFormatted).toBe('115,37 лв.');
  });

  it('handles zero', () => {
    const m = eurCentsToMoney(0);
    expect(m.eurFormatted).toBe('0,00 €');
    expect(m.bgnFormatted).toBe('0,00 лв.');
  });
});
