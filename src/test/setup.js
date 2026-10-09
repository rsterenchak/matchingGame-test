import '@testing-library/jest-dom'



// jsdom does not implement window.scrollTo; stub it so components that reset
// scroll position on mount don't log "Not implemented" errors.
window.scrollTo = () => {}
