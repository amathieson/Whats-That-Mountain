export const isIOS = !(
    navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
    navigator.userAgent.match(/AppleWebKit/)
);
