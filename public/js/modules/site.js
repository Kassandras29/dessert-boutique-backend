/**
 * Модуль общих скриптов сайта
 * Экспортируем одну функцию initSite() и вызываем её из main.js
 */

export function initSite() {
    setActiveNavigationItem();
    window.addEventListener('load', displayPageLoadTime);
}

function displayPageLoadTime() {
    const loadTime = Date.now() - performance.timeOrigin;
    const element = document.getElementById('clientElapsedTime');

    if (element) {
        element.textContent = Math.round(loadTime);
    }

    console.log(`Load time: ${Math.round(loadTime)} ms`);
}

function setActiveNavigationItem() {
    const currentPath = document.location.pathname;
    const navItems = document.querySelectorAll('.nav__link');

    navItems.forEach(item => {
        item.classList.remove('nav__link--active');

        const itemHref = item.getAttribute('href');
        if (!itemHref) return;

        const absoluteItemUrl = new URL(itemHref, document.location.href).pathname;
        if (absoluteItemUrl === currentPath) {
            item.classList.add('nav__link--active');
        }
    });
}
