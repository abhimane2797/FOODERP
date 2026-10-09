import type { Restaurant, Branch } from '../types'

export const restaurant: Restaurant = {
  id: 'rest-001',
  name: 'Spice Garden',
  logo: '',
  tagline: 'Fine Dining & Multi-Cuisine',
  currency: '₹',
  timezone: 'Asia/Kolkata',
}

export const branches: Branch[] = [
  { id: 'br-001', name: 'Main Branch', address: '12 MG Road, Pune', phone: '+91 98765 43210', isActive: true },
  { id: 'br-002', name: 'Koregaon Park', address: 'Lane 6, KP, Pune', phone: '+91 98765 43211', isActive: true },
  { id: 'br-003', name: 'Baner Outlet', address: 'Baner Road, Pune', phone: '+91 98765 43212', isActive: false },
]
