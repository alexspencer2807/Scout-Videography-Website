// Toggle mobile menu
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav-list');

  if (!hamburger || !navList) return;

  hamburger.addEventListener('click', () => {
    navList.classList.toggle('active');
  });
});
