export function setStickyHeight() {
    const sticky = document.querySelectorAll('.js-sticky');
    let height = 0;

    sticky.forEach((element) => {
        if (element.dataset.hidden) return;
        height += element.clientHeight;
    });

    document.documentElement.style.setProperty('--sticky-height', `${Math.ceil(height)}px`);
}
