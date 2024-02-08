export const isiPad = !(
    (navigator.userAgent.match(/(iPad)/) &&
    navigator.userAgent.match(/AppleWebKit/)) ||
    (
        /Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints && navigator.maxTouchPoints > 1
    )
);