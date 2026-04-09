import "./menu.css"

export function createMenu() {
    const menuBtn = document.getElementById('menu');

    if (!menuBtn) return;

    menuBtn.addEventListener('click', () => {
        const isOpen = menuBtn.classList.toggle('is-open');

        if (isOpen){

        } else {

        }
    });
}