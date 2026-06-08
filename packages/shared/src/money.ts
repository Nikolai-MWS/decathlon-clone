// Bulgaria's lev is pegged to the euro at a fixed rate.
export const BGN_PER_EUR = 1.95583;

export interface Money {
  /** Amount in euro cents (integer). */
  eurCents: number;
  /** Derived amount in stotinki (BGN cents, integer). */
  bgnCents: number;
  /** e.g. "58,99 €" */
  eurFormatted: string;
  /** e.g. "115,37 лв." */
  bgnFormatted: string;
}

function formatCents(cents: number, suffix: string): string {
  const value = (cents / 100).toFixed(2).replace('.', ',');
  return `${value} ${suffix}`;
}

export function eurCentsToMoney(eurCents: number): Money {
  const bgnCents = Math.round(eurCents * BGN_PER_EUR);
  return {
    eurCents,
    bgnCents,
    eurFormatted: formatCents(eurCents, '€'),
    bgnFormatted: formatCents(bgnCents, 'лв.'),
  };
}
