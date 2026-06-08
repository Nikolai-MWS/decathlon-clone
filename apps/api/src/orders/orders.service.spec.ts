import { OrdersService } from './orders.service';

// Exercise the pure delivery-pricing logic with stubbed dependencies.
function makeService(): OrdersService {
  return new OrdersService(
    {} as never, // orders repo
    {} as never, // skus repo
    {} as never, // cart service
    {} as never, // payments service
    {} as never, // data source
  );
}

describe('OrdersService.deliveryOptions', () => {
  it('charges office/home fees below the free threshold; store is always free', async () => {
    const options = await makeService().deliveryOptions(2000); // 20 €
    const byMethod = Object.fromEntries(options.map((o) => [o.method, o]));
    expect(byMethod.store.free).toBe(true);
    expect(byMethod.store.fee.eurCents).toBe(0);
    expect(byMethod.office.free).toBe(false);
    expect(byMethod.office.fee.eurCents).toBe(199);
    expect(byMethod.home.free).toBe(false);
    expect(byMethod.home.fee.eurCents).toBe(399);
  });

  it('makes office and home free at or above 50 €', async () => {
    const options = await makeService().deliveryOptions(5000); // 50 €
    for (const o of options) {
      expect(o.free).toBe(true);
      expect(o.fee.eurCents).toBe(0);
    }
  });
});
