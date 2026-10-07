import { EVENTS } from "./consts"

// Hash-based routing (e.g. /WebStockCopy/#/pieces/X) so deep links work on
// static hosting such as GitHub Pages without server rewrites.
export function getCurrentPath () {
    const path = window.location.hash.replace(/^#/, '')
    return path.startsWith('/') ? path : '/'
}

export function navigateTo (href) {
    window.history.pushState({}, '', `#${href}`)
    const navigationEvent = new Event(EVENTS.PUSHSTATE)
    window.dispatchEvent(navigationEvent)
}

export function CustomLink ({ target, to, ...props }) {
    const handleClick = (event) => {
        const isMainEvent = event.button === 0
        const isModifiedEvent = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
        const isManagedEvent = target === undefined || target === '_self'
        if (isMainEvent && isManagedEvent && !isModifiedEvent) {
            event.preventDefault()
            navigateTo(to)
        }
    }

    return <a href={`#${to}`} onClick={handleClick} target={target} {...props} />
}
