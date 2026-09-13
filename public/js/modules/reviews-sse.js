const status = document.getElementById(
  'reviewsConnectionStatus',
);

const updates = document.getElementById(
  'reviewUpdates',
);

if (status && updates) {
  const source = new EventSource('/reviews/events');

  source.onopen = () => {
    status.textContent =
      'Соединение с обновлениями активно';
  };

  source.onmessage = (event) => {
    const payload = JSON.parse(event.data);

    const message = document.createElement('p');

    message.textContent = payload.message;

    updates.prepend(message);
  };

  source.onerror = () => {
    status.textContent =
      'Соединение с обновлениями временно потеряно';
  };

  window.addEventListener('beforeunload', () => {
    source.close();
  });
}
