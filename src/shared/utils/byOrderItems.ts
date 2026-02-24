/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export type OrderField = 'createdAt' | 'name';
export type OrderDirection = 'asc' | 'desc';

export function byOrderItem<T extends { createdAt?: Date; name?: string }>(
  items: T[],
  field: OrderField,
  direction: OrderDirection = 'asc',
): T[] {
  return items.sort((a, b) => {
    let valueA: any = a[field];
    let valueB: any = b[field];

    if (field === 'createdAt') {
      valueA = valueA ? new Date(valueA).getTime() : 0;
      valueB = valueB ? new Date(valueB).getTime() : 0;
    }

    if (field === 'name') {
      valueA = valueA ? valueA.toLowerCase() : '';
      valueB = valueB ? valueB.toLowerCase() : '';
    }

    if (valueA < valueB) return direction === 'asc' ? -1 : 1;
    if (valueA > valueB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}
