/**
 * Точка входа ES-модулей (подключается на всех страницах)
 * Динамически подключаем модули только там, где есть нужная разметка
 */

import { initSite } from './modules/site.js';
initSite();

if (document.getElementById('reviewForm')) {
    const { initReviews } = await import('./modules/reviews.js');
    initReviews();
}

if (document.getElementById('loadUsersBtn')) {
    const { initUsers } = await import('./modules/users.js');
    initUsers();
}
