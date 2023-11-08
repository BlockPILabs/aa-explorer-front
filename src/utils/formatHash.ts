/**
 * @param {*} str
 * @returns
 */
export function formatHash(
  str: string,
  frontLen: number = 6,
  endLen: number = 4
) {
  if (!str) {
    return ''
  }
  if (str.length > frontLen + endLen) {
    return (
      str.substring(0, frontLen) + '...' + str.substring(str.length - endLen)
    )
  }
  return str || ''
}
