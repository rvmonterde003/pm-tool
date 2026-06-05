import { startOfISOWeek, endOfISOWeek, format, parseISO } from 'date-fns'

export function getCurrentMonday(date: Date = new Date()): string {
  return format(startOfISOWeek(date), 'yyyy-MM-dd')
}

export function getWeekRange(mondayStr: string): string {
  const monday = parseISO(mondayStr)
  const sunday = endOfISOWeek(monday)
  return `${format(monday, 'MMM d')} – ${format(sunday, 'MMM d, yyyy')}`
}
