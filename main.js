window.addEventListener('load', () => {
  navigator.serviceWorker.register('./sw.js').then(
    (registration) => {
      console.log('ServiceWorker登録成功');
      console.log(registration);
    },
    (err) => {
      console.log('ServiceWorker登録失敗', err);
    }
  );
});
