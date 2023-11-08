import { dayjs } from '@/utils/dayjs'

export function getOffset() {
  const offset = dayjs().utcOffset() / 60
  return offset > 0 ? `+${offset}` : offset
}

/**
 * @param {number} timestamp
 */
export function isToday(timestamp) {
  if (!timestamp) {
    return false
  }

  const target = dayjs(timestamp).startOf('day').valueOf()
  const today = dayjs().startOf('day').valueOf()
  return target === today
}

/**
 * @param {number} bookTimestamp
 */
export function isOverBookTime(bookTimestamp) {
  const nowTime = dayjs().set({ year: 2000, month: 1 }).valueOf()
  const bookTime = dayjs(bookTimestamp).set({ year: 2000, month: 1 }).valueOf()

  return nowTime > bookTime
}

export function parseDateToTimeInterval(
  timestamp,
  startKey = 'start_time',
  endKey = 'end_time'
) {
  if (timestamp) {
    return {
      [startKey]: dayjs(+timestamp).startOf('day').valueOf(),
      [endKey]: dayjs(+timestamp).endOf('day').valueOf()
    }
  }
  return {
    [startKey]: null,
    [endKey]: null
  }
}

/**
 * @param {*} date
 */
export function validDate(date) {
  if (!date) return false
  return dayjs(date).isValid()
}

/**
 * @param {*} time
 * @param {*} format
 * @param {*} timeFormat
 */
export function formatTime(
  time,
  format = 'MMM DD, YYYY HH:mm',
  timeFormat = ''
) {
  if (format.startsWith('fmt:')) {
    const baseFormat = 'YYYY-MM-DD HH:mm:ss'
    const range = format.replace('fmt:', '').split('')
    const from = baseFormat.indexOf(range[0]) || 0
    const to = baseFormat.lastIndexOf(range[1]) + 1 || baseFormat.length
    format = baseFormat.substring(from, to)
  }
  if (!time) return dayjs().format(format)
  return timeFormat
    ? dayjs(time, timeFormat).format(format)
    : dayjs(time).format(format)
}

/**
 * @param {*} time
 * @param {*} format
 * @param {*} timeFormat
 */
export function formatUtcTime(
  time,
  format = 'MMM DD, YYYY HH:mm',
  timeFormat = ''
) {
  if (format.startsWith('fmt:')) {
    const baseFormat = 'YYYY-MM-DD HH:mm:ss'
    const range = format.replace('fmt:', '').split('')
    const from = baseFormat.indexOf(range[0]) || 0
    const to = baseFormat.lastIndexOf(range[1]) + 1 || baseFormat.length
    format = baseFormat.substring(from, to)
  }
  if (!time) return dayjs.utc().format(format)
  return timeFormat
    ? dayjs.utc(time, timeFormat).format(format)
    : dayjs.utc(time).format(format)
}

export function calcDiffTime(time) {
  const now = Number(dayjs().format('x'))
  const diff = time - now
  if (diff > 0 && diff < 1000 * 60) {
    const differ = dayjs(time).diff(now, 's')
    return differ + (differ === 1 ? ' second' : ' seconds')
  } else if (diff >= 1000 * 60 && diff < 1000 * 60 * 60) {
    const differ = dayjs(time).diff(now, 'm')
    return differ + (differ === 1 ? ' minute' : ' minutes')
  } else if (diff >= 1000 * 60 * 60) {
    const differ = dayjs(time).diff(now, 'h')
    return differ + (differ === 1 ? ' hour' : ' hours')
  }
  return 'is-cached-data'
}

export function calcDiffTimePast(time) {
  // const now = Number(dayjs().format('x'))
  // const diff = now - time
  // if (diff > 0 && diff < 1000 * 60) {
  //   const differ = dayjs(now).diff(time, 's')
  //   return differ + (differ === 1 ? ' second' : ' seconds')
  // } else if (diff >= 1000 * 60 && diff < 1000 * 60 * 60) {
  //   const differ = dayjs(now).diff(time, 'm')
  //   return differ + (differ === 1 ? ' minute' : ' minutes')
  // } else if (diff >= 1000 * 60 * 60) {
  //   const differ = dayjs(now).diff(time, 'h')
  //   return differ + (differ === 1 ? ' hour' : ' hours')
  // }
  // return 'is-cached-data'
  return dayjs(time).fromNow()
}

export function calcDiffTimeMin(time) {
  const now = Number(dayjs().format('x'))
  const diff = time - now
  if (diff > 0 && diff < 1000 * 60) {
    return '1 min'
  } else if (diff >= 1000 * 60 && diff < 1000 * 60 * 60) {
    const differ = dayjs(time).diff(now, 'm')
    return differ + (differ === 1 ? ' min' : ' mins')
  } else if (diff >= 1000 * 60 * 60) {
    const differ = dayjs(time).diff(now, 'h')
    return differ + (differ === 1 ? ' hour' : ' hours')
  }
  return 'now'
}
