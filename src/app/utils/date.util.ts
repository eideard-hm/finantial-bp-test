import { formatDate } from '@angular/common';

/**
 * Añadir años a una fecha
 * @param date
 * @param years
 * @returns
 */
export function addYearsToDate(date?: Date, years = 1): Date {
  date = date || new Date();

  return new Date(date.setFullYear(date.getFullYear() + years));
}

/**
 * Formatea una fecha en formato 'yyyy-MM-dd'
 * @param date
 * @returns
 */
export function formatInputDate(date: Date) {
  return formatDate(date, 'yyyy-MM-dd', 'en');
}
