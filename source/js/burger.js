const openBtn = document.querySelector('.main-nav__burger');
const nav = document.querySelector('..main-nav__list');
const body = document.querySelector('body')

openBtn.addEventListener('click', e=> {
    nav.classList.toggle('.main-nav__list--visible')
    openBtn.classList.toggle('main-nav__burger--opened')
    body.classList.toggle('body--locked')
  }
)
