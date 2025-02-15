export function capitalize(value: string) {
  return value
    .split(' ')
    .map((text) => `${text[0].toUpperCase()}${text.substring(1)}`)
    .join(' ')
}

export function truncateAddress(address?: string, start = 6, end = 4) {
  if (!address) return ''
  return `${address.slice(0, start)}...${address.slice(end * -1)}`
}

export function formatTimer(value: number) {
  return String(value).padStart(2, '0')
}

export function parseMarkdown(value: string) {
  const rawHtmlString = value
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>') // NOTE: bold
    .replace(/\*(.*)\*/gim, '<em>$1</em>') // NOTE: italic
    .replace(/\n$/gim, '<br />')
  return rawHtmlString.trim()
}
