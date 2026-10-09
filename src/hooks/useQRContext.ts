import { useParams, useNavigate, generatePath } from 'react-router-dom'
import { useMemo } from 'react'
import { getQRRestaurant, getQRTable, type QRRestaurant, type QRTable } from '../mock/mockQR'

/**
 * Resolves the restaurant + table from `/qr/:restaurantId/:tableId/...`
 * and exposes path helpers so no customer page ever hardcodes a URL or a
 * restaurant name.
 *
 * Backed by `mockQR` today; swap that module for an API lookup and the
 * customer UI is unchanged.
 */
export function useQRContext() {
  const { restaurantId = 'demo-restaurant', tableId = 'table-12', orderId } = useParams<{
    restaurantId: string
    tableId: string
    orderId?: string
  }>()
  const navigate = useNavigate()

  const restaurant: QRRestaurant = useMemo(() => getQRRestaurant(restaurantId), [restaurantId])
  const table: QRTable = useMemo(() => getQRTable(restaurantId, tableId), [restaurantId, tableId])

  const base = `/qr/${restaurantId}/${tableId}`

  return {
    restaurantId,
    tableId,
    orderId: orderId ?? null,
    restaurant,
    table,
    /** "Table 12" */
    tableLabel: table.label,
    /** "Demo Restaurant" */
    restaurantName: restaurant.name,
    paths: {
      menu: base,
      cart: `${base}/cart`,
      order: (id?: string) => `${base}/order/${id ?? orderId ?? '1056'}`,
      bill: `${base}/bill`,
      payment: `${base}/payment`,
      feedback: `${base}/feedback`,
    },
    go: {
      menu: () => navigate(base),
      cart: () => navigate(`${base}/cart`),
      order: (id?: string) => navigate(`${base}/order/${id ?? orderId ?? '1056'}`),
      bill: () => navigate(`${base}/bill`),
      payment: () => navigate(`${base}/payment`),
      feedback: () => navigate(`${base}/feedback`),
    },
    /** React Router `generatePath` style, for cases needing a literal path. */
    pathFor: (suffix: string) => generatePath(`${base}/${suffix}`, { restaurantId, tableId }),
  }
}
