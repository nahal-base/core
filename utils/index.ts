export { isAuthenticated } from './authentication'
export { isRtl } from './direction'
export { formatDate } from './date'

export const findOneByKeyInList = <T>(list: T[], key: keyof T, value: any): T | undefined => {
  const index = list.findIndex((item) => item[key] === value)
  if (index < 0) return undefined
  return list[index]
}
