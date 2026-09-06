/**
 * Модуль отзывов
 * Используем сторонние библиотеки:
 * marked: парсит Markdown в HTML
 * DOMPurify: очищает HTML от опасных тегов/атрибутов (защита от XSS)
 */

const STORAGE_KEY = 'dessertBoutiqueReviews';

export function initReviews() {
    const form = document.getElementById('reviewForm');
    const container = document.getElementById('reviewsContainer');
    const template = document.getElementById('reviewTemplate');

    if (!form || !container || !template) return;

    let currentEditId = null;

    function getReviews() {
        const reviews = localStorage.getItem(STORAGE_KEY);
        return reviews ? JSON.parse(reviews) : [];
    }

    function saveReviews(reviews) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    }

    function loadReviewsFromStorage() {
        const reviews = getReviews();
        container.innerHTML = '';
        reviews.forEach(review => renderReview(review));
    }

    function renderReview(review) {
        const clone = template.content.cloneNode(true);

        clone.querySelector('.review__title').textContent = review.product;

        const textEl = clone.querySelector('.review__text');

        if (window.marked && window.DOMPurify) {

            window.marked.setOptions({ gfm: true, breaks: true });

            textEl.innerHTML = window.DOMPurify.sanitize(window.marked.parse(review.text));
        } else {
            textEl.textContent = review.text;
        }

        const authorEl = clone.querySelector('.review__author');
        const separatorEl = clone.querySelector('.review__author-separator');

        if (review.author && review.author.trim() !== '') {
            authorEl.textContent = review.author;
            authorEl.style.display = 'inline';
            separatorEl.style.display = 'inline';
        } else {
            authorEl.style.display = 'none';
            separatorEl.style.display = 'none';
        }

        clone.querySelector('.rating-value').textContent = review.rating;

        const timeEl = clone.querySelector('time');
        const date = new Date(review.date);
        timeEl.textContent = date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const editBtn = clone.querySelector('.review__edit');
        const deleteBtn = clone.querySelector('.review__delete');

        editBtn.addEventListener('click', () => editReview(review.id));
        deleteBtn.addEventListener('click', () => deleteReview(review.id));

        container.appendChild(clone);
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const product = document.getElementById('product').value.trim();
        const author = document.getElementById('author').value.trim();
        const rating = document.getElementById('rating').value;
        const text = document.getElementById('text').value.trim();

        if (currentEditId) {
            updateReview(currentEditId, { product, author, rating, text });
        } else {
            const newReview = {
                id: Date.now().toString(),
                product,
                author: author || '',
                rating,
                text,
                date: new Date().toISOString()
            };

            const reviews = getReviews();
            reviews.push(newReview);
            saveReviews(reviews);
            renderReview(newReview);
        }

        form.reset();
        currentEditId = null;
        form.querySelector('button[type="submit"]').textContent = 'Добавить отзыв';
    });

    function editReview(id) {
        const review = getReviews().find(r => r.id === id);
        if (!review) return;

        document.getElementById('product').value = review.product;
        document.getElementById('author').value = review.author || '';
        document.getElementById('rating').value = review.rating;
        document.getElementById('text').value = review.text;

        currentEditId = id;

        form.querySelector('button[type="submit"]').textContent = 'Сохранить изменения';
        form.scrollIntoView({ behavior: 'smooth' });
    }

    function updateReview(id, updatedData) {
        const reviews = getReviews();
        const index = reviews.findIndex(r => r.id === id);

        if (index !== -1) {
            reviews[index] = {
                ...reviews[index],
                ...updatedData,
                date: new Date().toISOString()
            };

            saveReviews(reviews);
            loadReviewsFromStorage();
        }

        currentEditId = null;
    }

    function deleteReview(id) {
        if (confirm('Вы уверены, что хотите удалить отзыв?')) {
            let reviews = getReviews();
            reviews = reviews.filter(r => r.id !== id);
            saveReviews(reviews);
            loadReviewsFromStorage();

            if (currentEditId === id) {
                form.reset();
                currentEditId = null;
                form.querySelector('button[type="submit"]').textContent = 'Добавить отзыв';
            }
        }
    }

    loadReviewsFromStorage();
}
