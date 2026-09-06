/**
 * Модуль "Наши клиенты"
 */

const API_URL = 'https://jsonplaceholder.typicode.com';

export function initUsers() {
    const loadBtn = document.getElementById('loadUsersBtn');
    const container = document.getElementById('usersContainer');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('errorMessage');

    if (!loadBtn || !container || !loader || !errorMessage) return;

    function getRandomUserIds(count) {
        const userIds = [];
        while (userIds.length < count) {
            const randomId = Math.floor(Math.random() * 10) + 1; // 1-10
            if (!userIds.includes(randomId)) {
                userIds.push(randomId);
            }
        }
        return userIds;
    }

    function showError(message, type = 'danger') {
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = `
            <div class="error error--${type}">
                <strong>Ошибка:</strong> ${message}
            </div>
        `;
        container.innerHTML = '';
    }

    function hideError() {
        errorMessage.style.display = 'none';
        errorMessage.innerHTML = '';
    }

    function showLoader() {
        loader.style.display = 'block';
        container.innerHTML = '';
        hideError();
    }

    function hideLoader() {
        loader.style.display = 'none';
    }

    function renderUsers(users) {
        container.innerHTML = '';

        if (users.length === 0) {
            container.innerHTML = '<p class="no-results">Нет пользователей для отображения</p>';
            return;
        }

        users.forEach(user => {
            const clone = document.getElementById('userTemplate').content.cloneNode(true);

            clone.querySelector('.user__name').textContent = user.name;
            clone.querySelector('.user__username').textContent = `@${user.username}`;
            clone.querySelector('.user__email').textContent = `Email: ${user.email}`;
            clone.querySelector('.user__phone').textContent = `Телефон: ${user.phone}`;
            clone.querySelector('.user__website').textContent = `Сайт: ${user.website}`;

            const addressParts = [
                user.address.street,
                user.address.suite,
                user.address.city,
                user.address.zipcode
            ];

            clone.querySelector('.user__address-text').textContent = addressParts.join(', ');

            clone.querySelector('.user__company-name').textContent = user.company.name;
            clone.querySelector('.user__company-catchphrase').textContent = `"${user.company.catchPhrase}"`;

            container.appendChild(clone);
        });
    }

    async function fetchUserById(userId) {
        const response = await fetch(`${API_URL}/users/${userId}`);
        if (!response.ok) {
            throw new Error(`Не удалось загрузить пользователя с ID ${userId}`);
        }
        return await response.json();
    }

    async function loadUsers() {
        showLoader();

        try {
            const userIds = getRandomUserIds(3);
            console.log('Загружаем пользователей с ID:', userIds);

            const userPromises = userIds.map(id => fetchUserById(id));
            const users = await Promise.all(userPromises);

            renderUsers(users);
            hideError();
        } catch (error) {
            console.error('Ошибка загрузки:', error);

            if (error.message.includes('Failed to fetch') || !navigator.onLine) {
                showError('Не удалось подключиться к серверу. Проверьте подключение к интернету.');
            } else if (error.message.includes('404')) {
                showError('Запрашиваемый пользователь не найден.');
            } else {
                showError(`Произошла ошибка: ${error.message}`);
            }

            container.innerHTML = '';
        } finally {
            hideLoader();
        }
    }

    loadBtn.addEventListener('click', loadUsers);
}
