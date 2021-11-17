let throttlePause = false;

export default function throttle(callback, milliseconds = 100, ...argv) {
    if (throttlePause) return;
    throttlePause = true;
    setTimeout(() => {
        callback(...argv);
        throttlePause = false;
    }, milliseconds);
}
