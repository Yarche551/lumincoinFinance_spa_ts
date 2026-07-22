export class Accordion {
    public incomes_button: HTMLElement | null;
    public expenses_button: HTMLElement | null;
    public acc: NodeListOf<Element>;
    public right_arrow: HTMLElement | null;
    public down_arrow: HTMLElement | null;

    constructor() {
        this.incomes_button = document.getElementById("incomes-button");
        this.expenses_button = document.getElementById("expenses-button");
        this.acc = document.querySelectorAll(".accordion");
        this.right_arrow = document.getElementById("right-arrow");
        this.down_arrow = document.getElementById("down-arrow");

        this.acc.forEach((button: Element) => {
            button.addEventListener("click", () => {
                button.classList.toggle("active");

                if (this.down_arrow) {
                    this.down_arrow.classList.toggle("d-none");
                }
                if (this.right_arrow) {
                    this.right_arrow.classList.toggle("d-none");
                }

                const panel = button.nextElementSibling as HTMLElement | null;
                if (panel) {
                    if (panel.style.display === "block") {
                        panel.style.display = "none";
                    } else {
                        panel.style.display = "block";
                    }
                }
            });
        });

        this.incomes_button?.addEventListener("click", () => {
            if (this.incomes_button?.classList.contains("active")) {
                this.expenses_button?.classList.remove("active");
            } else {
                this.incomes_button?.classList.add("active");
                this.expenses_button?.classList.remove("active");
            }
        })

        this.expenses_button?.addEventListener("click", () => {
            if (this.expenses_button?.classList.contains("active")) {
                this.incomes_button?.classList.remove("active");
            } else {
                this.expenses_button?.classList.add("active");
                this.incomes_button?.classList.remove("active");
            }
        })

        const categoryRoutes = ['/incomes', '/incomes-create', '/incomes-edit', '/expenses', '/expenses-create', '/expenses-edit'];
        if (categoryRoutes.includes(window.location.pathname)) {
            this.acc.forEach((button: Element) => {
                button.classList.add('active');
            
                // замена кода
                const panel = button.nextElementSibling as HTMLElement | null;
                if (panel) {
                    panel.style.display = 'block';
                }
            });
            this.down_arrow?.classList.remove('d-none');
            this.right_arrow?.classList.add('d-none');
        }
    }
}
