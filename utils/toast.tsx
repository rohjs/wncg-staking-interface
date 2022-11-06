export function renderToastBadge(type: ToastType) {
  switch (type) {
    case 'success':
      return <span aria-hidden>Success</span>
    case 'error':
      return <span aria-hidden>Fail</span>
    default:
      return null
  }
}
