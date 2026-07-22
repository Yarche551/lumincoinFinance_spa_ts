export class ProfilePopup {
    private static outsideBound: boolean = false;

    constructor() {
        const icon: HTMLElement | null = document.getElementById('profile-icon');
        const popup: HTMLElement | null = document.getElementById('logout-popup');

        if (!icon || !popup) {
            return;
        }

        icon.addEventListener('click', () => {
            popup.classList.toggle('d-none');
        });

        if (!ProfilePopup.outsideBound) {
            document.addEventListener('click', ProfilePopup.handleOutsideClick);
            ProfilePopup.outsideBound = true;
        }
    }

    private static handleOutsideClick(e: MouseEvent): void {
        const icon: HTMLElement | null = document.getElementById('profile-icon');
        const popup: HTMLElement | null = document.getElementById('logout-popup');
        const target: Node | null = e.target as Node | null;

        if (!icon || !popup || !target) {
            return;
        }

        if (!icon.contains(target) && !popup.contains(target)) {
            popup.classList.add('d-none');
        }
    }
}