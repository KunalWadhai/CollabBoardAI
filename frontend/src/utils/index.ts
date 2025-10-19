// Utility functions

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}

export const formatDate = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const splitLines = (text: string): string[] => {
  return text.split('\n').filter(line => line.trim())
}

export const joinLines = (lines: string[]): string => {
  return lines.join('\n')
}

export const splitLinesWithNumbers = (text: string): { line: string; number: number }[] => {
  return text.split('\n').map((line, index) => ({
    line: line.trim(),
    number: index + 1,
  }))
}

export const joinLinesWithNumbers = (lines: { line: string; number: number }[]): string => {
  return lines.map(({ line }) => line).join('\n')
}

export const splitLinesWithNumbersAndRanges = (text: string): { line: string; number: number; ranges: { start: number; end: number }[] }[] => {
  return text.split('\n').map((line, index) => ({
    line: line.trim(),
    number: index + 1,
    ranges: [{ start: 0, end: line.length }],
  }))
}

export const joinLinesWithNumbersAndRanges = (lines: { line: string; number: number; ranges: { start: number; end: number }[] }[]): string => {
  return lines.map(({ line }) => line).join('\n')
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export const downloadFile = (content: string, filename: string, mimeType: string = 'text/plain'): void => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

