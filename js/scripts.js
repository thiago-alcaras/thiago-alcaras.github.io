'use strict';
const filters = document.querySelector('.filters');
const cards = [...document.querySelectorAll('.project-card')];
const status = document.querySelector('#filter-status');
if (filters && cards.length && status) {
  filters.hidden = false;
  filters.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-filter]');
    if (!button || !filters.contains(button)) return;
    const filter = button.dataset.filter;
    filters.querySelectorAll('button').forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    let visible = 0;
    cards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.category.split(' ').includes(filter);
      card.hidden = !matches;
      if (matches) visible++;
    });
    status.textContent = `${visible} ${visible === 1 ? 'projeto exibido' : 'projetos exibidos'}.`;
  });
}
const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());
