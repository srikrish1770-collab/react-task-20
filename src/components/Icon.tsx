const paths: Record<string, string> = {
  grid: 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z', truck: 'M1 6h13v10H1zM14 10h5l3 3v3h-8zM6 19a2 2 0 100-4 2 2 0 000 4zM18 19a2 2 0 100-4 2 2 0 000 4z',
  users: 'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z', box: 'M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',
  pin: 'M12 21s-7-6-7-11a7 7 0 1114 0c0 5-7 11-7 11zM12 12a2 2 0 100-4 2 2 0 000 4z', bell: 'M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0',
  search: 'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3', alert: 'M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z', gauge: 'M12 14l4-4M3 17a9 9 0 1118 0', check: 'M20 6L9 17l-5-5',
  menu: 'M4 6h16M4 12h16M4 18h16', x: 'M18 6L6 18M6 6l12 12', 'chevrons-left': 'M11 17l-5-5 5-5M18 17l-5-5 5-5', 'chevrons-right': 'M13 17l5-5-5-5M6 17l5-5-5-5'
}
export const Icon = ({ name, size = 18 }: { name: string; size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={paths[name]} /></svg>
