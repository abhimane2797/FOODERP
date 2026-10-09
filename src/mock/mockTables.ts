import type { RestaurantTable } from '../types'

export const mockTables: RestaurantTable[] = [
  { id: 'tbl-01', name: 'Table 01', seats: 4, floor: 'Floor 1', status: 'available', qrActive: true },
  { id: 'tbl-02', name: 'Table 02', seats: 4, floor: 'Floor 1', status: 'occupied', currentOrderId: 'ord-1056', currentBill: 1250, qrActive: true },
  { id: 'tbl-03', name: 'Table 03', seats: 6, floor: 'Floor 1', status: 'reserved', reservedFor: 'Sharma Family', reservedAt: '7:30 PM', qrActive: true },
  { id: 'tbl-04', name: 'Table 04', seats: 2, floor: 'Floor 1', status: 'available', qrActive: true },
  { id: 'tbl-05', name: 'Table 05', seats: 4, floor: 'Floor 1', status: 'billing', currentOrderId: 'ord-1051', currentBill: 890, qrActive: true },
  { id: 'tbl-06', name: 'Table 06', seats: 8, floor: 'Floor 1', status: 'occupied', currentOrderId: 'ord-1053', currentBill: 3420, qrActive: true },
  { id: 'tbl-07', name: 'Table 07', seats: 4, floor: 'Floor 2', status: 'available', qrActive: true },
  { id: 'tbl-08', name: 'Table 08', seats: 4, floor: 'Floor 2', status: 'occupied', currentOrderId: 'ord-1054', currentBill: 670, qrActive: true },
  { id: 'tbl-09', name: 'Table 09', seats: 6, floor: 'Floor 2', status: 'reserved', reservedFor: 'Mr. Patel', reservedAt: '8:00 PM', qrActive: false },
  { id: 'tbl-10', name: 'Table 10', seats: 2, floor: 'Floor 2', status: 'available', qrActive: true },
  { id: 'tbl-11', name: 'Table 11', seats: 4, floor: 'Outdoor', status: 'available', qrActive: true },
  { id: 'tbl-12', name: 'Table 12', seats: 6, floor: 'Outdoor', status: 'occupied', currentOrderId: 'ord-1056', currentBill: 494, qrActive: true },
  { id: 'tbl-13', name: 'Table 13', seats: 4, floor: 'Outdoor', status: 'available', qrActive: true },
  { id: 'tbl-14', name: 'Table 14', seats: 8, floor: 'Outdoor', status: 'available', qrActive: false },
]

export const mockFloors = ['Floor 1', 'Floor 2', 'Outdoor']
