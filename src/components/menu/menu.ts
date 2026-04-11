import "./menu.css"

/**
 * Initializes the mobile hamburger menu toggle functionality.
 * Note: Currently unused in the final layout, kept for possible implementations.
 */
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