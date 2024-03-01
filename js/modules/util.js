export const isiPad = !(
    (navigator.userAgent.match(/(iPad)/) &&
    navigator.userAgent.match(/AppleWebKit/)) ||
    (
        /Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints && navigator.maxTouchPoints > 1
    )
);

//https://stackoverflow.com/a/196991
export const toTitleCase = (str)=> {
    if (!str)
        return ""
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}