import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export { Button, type ButtonProps } from './button'
export { Input, type InputProps } from './input'
export { Card, CardHeader, CardBody } from './card'
export { Badge, type BadgeVariant } from './badge'
export { Select, type SelectOption } from './select'
export { Modal } from './modal'
export { Table } from './table'
export { Spinner } from './spinner'
