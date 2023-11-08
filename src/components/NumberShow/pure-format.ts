import numbro from 'numbro'

export function pureFormatNumber(
  number: number,
  format = '0,0',
  roundingFunction = Math.floor
) {
  let lastFormat
  if (format === '0,0') {
    lastFormat = {
      thousandSeparated: true,
      trimMantissa: true,
      mantissa: 0
    }
  } else {
    lastFormat = format
  }
  const roundingFn = (num: number) => {
    return roundingFunction(num)
  }
  numbro.setDefaults({
    roundingFunction: roundingFn
  })
  return numbro(number).format(lastFormat).toLocaleUpperCase() as string
}
