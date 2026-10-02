export const SEEN_KEY = "mz-intro-seen";

/**
 * Runs inline before first paint: marks <html data-mz-seen> when the intro
 * already played this session, so CSS hides it with no flash.
 */
export const INTRO_SEEN_SCRIPT = `try{if(sessionStorage.getItem("${SEEN_KEY}"))document.documentElement.dataset.mzSeen="1"}catch(e){}`;
