export class ButtonsRow {
    public today: HTMLElement | null;
    public week: HTMLElement | null;
    public month: HTMLElement | null;
    public year: HTMLElement | null;
    public all: HTMLElement | null;
    public interval: HTMLElement | null;
    public date_1: HTMLElement | null;
    public date_2: HTMLElement | null;

    constructor() {

        this.today = document.getElementById("today");
        this.week = document.getElementById("week");
        this.month = document.getElementById("month");
        this.year = document.getElementById("year");
        this.all = document.getElementById("all");
        this.interval = document.getElementById("interval");

        this.date_1 = document.getElementById("date-1");
        this.date_2 = document.getElementById("date-2");

        // клод добавил: ссылка остаётся обычной серой ссылкой,
        // а реальный выбор даты идёт через скрытый input[type=date] рядом
        const date_1_input = document.getElementById("date-1-input");
        const date_2_input = document.getElementById("date-2-input");

        const date_1: HTMLElement | null = this.date_1;
        if (date_1 && date_1_input instanceof HTMLInputElement) {
            date_1.addEventListener("click", (e: Event) => {
                e.preventDefault();
                date_1_input.showPicker();
            });
            date_1_input.addEventListener("change", () => {
                date_1.innerText = date_1_input.value;
            });
        }

        const date_2: HTMLElement | null = this.date_2;
        if (date_2 && date_2_input instanceof HTMLInputElement) {
            date_2.addEventListener("click", (e: Event) => {
                e.preventDefault();
                date_2_input.showPicker();
            });
            date_2_input.addEventListener("change", () => {
                date_2.innerText = date_2_input.value;
            });
        }

        if (this.today) {
            this.today.addEventListener("click", () => {
                if (this.today && !this.today.classList.contains("active")) {
                    this.today.classList.add("active");
                    this.today.classList.remove("bg-transparent");
                    this.today.classList.add("bg-secondary");
                    this.today.classList.add("text-white");

                    if (this.month) {
                        this.month.classList.remove("text-white");
                        this.month.classList.remove("bg-secondary");
                        this.month.classList.add("bg-transparent");
                        this.month.classList.remove("active");
                    }

                    if (this.year) {
                        this.year.classList.remove("text-white");
                        this.year.classList.remove("bg-secondary");
                        this.year.classList.add("bg-transparent");
                        this.year.classList.remove("active");
                    }

                    if (this.week) {
                        this.week.classList.remove("text-white");
                        this.week.classList.remove("bg-secondary");
                        this.week.classList.add("bg-transparent");
                        this.week.classList.remove("active");
                    }

                    if (this.all) {
                        this.all.classList.remove("text-white");
                        this.all.classList.remove("bg-secondary");
                        this.all.classList.add("bg-transparent");
                        this.all.classList.remove("active");
                    }

                    if (this.interval) {
                        this.interval.classList.remove("text-white");
                        this.interval.classList.remove("bg-secondary");
                        this.interval.classList.add("bg-transparent");
                        this.interval.classList.remove("active");
                    }
                }
            });
        }

        if (this.week) {
            this.week.addEventListener("click", () => {
                if (this.week && !this.week.classList.contains("active")) {
                    this.week.classList.add("active");
                    this.week.classList.remove("bg-transparent");
                    this.week.classList.add("bg-secondary");
                    this.week.classList.add("text-white");

                    if (this.month) {
                        this.month.classList.remove("text-white");
                        this.month.classList.remove("bg-secondary");
                        this.month.classList.add("bg-transparent");
                        this.month.classList.remove("active");
                    }

                    if (this.year) {
                        this.year.classList.remove("text-white");
                        this.year.classList.remove("bg-secondary");
                        this.year.classList.add("bg-transparent");
                        this.year.classList.remove("active");
                    }

                    if (this.today) {
                        this.today.classList.remove("text-white");
                        this.today.classList.remove("bg-secondary");
                        this.today.classList.add("bg-transparent");
                        this.today.classList.remove("active");
                    }

                    if (this.all) {
                        this.all.classList.remove("text-white");
                        this.all.classList.remove("bg-secondary");
                        this.all.classList.add("bg-transparent");
                        this.all.classList.remove("active");
                    }

                    if (this.interval) {
                        this.interval.classList.remove("text-white");
                        this.interval.classList.remove("bg-secondary");
                        this.interval.classList.add("bg-transparent");
                        this.interval.classList.remove("active");
                    }
                }
            });
        }

        if (this.month) {
            this.month.addEventListener("click", () => {
                if (this.month && !this.month.classList.contains("active")) {
                    this.month.classList.add("active");
                    this.month.classList.remove("bg-transparent");
                    this.month.classList.add("bg-secondary");
                    this.month.classList.add("text-white");

                    if (this.today) {
                        this.today.classList.remove("text-white");
                        this.today.classList.remove("bg-secondary");
                        this.today.classList.add("bg-transparent");
                        this.today.classList.remove("active");
                    }

                    if (this.week) {
                        this.week.classList.remove("text-white");
                        this.week.classList.remove("bg-secondary");
                        this.week.classList.add("bg-transparent");
                        this.week.classList.remove("active");
                    }

                    if (this.year) {
                        this.year.classList.remove("text-white");
                        this.year.classList.remove("bg-secondary");
                        this.year.classList.add("bg-transparent");
                        this.year.classList.remove("active");
                    }

                    if (this.all) {
                        this.all.classList.remove("text-white");
                        this.all.classList.remove("bg-secondary");
                        this.all.classList.add("bg-transparent");
                        this.all.classList.remove("active");
                    }

                    if (this.interval) {
                        this.interval.classList.remove("text-white");
                        this.interval.classList.remove("bg-secondary");
                        this.interval.classList.add("bg-transparent");
                        this.interval.classList.remove("active");
                    }
                }
            });
        }

        if (this.year) {
            this.year.addEventListener("click", () => {
                if (this.year && !this.year.classList.contains("active")) {
                    this.year.classList.add("active");
                    this.year.classList.remove("bg-transparent");
                    this.year.classList.add("bg-secondary");
                    this.year.classList.add("text-white");

                    if (this.today) {
                        this.today.classList.remove("text-white");
                        this.today.classList.remove("bg-secondary");
                        this.today.classList.add("bg-transparent");
                        this.today.classList.remove("active");
                    }

                    if (this.week) {
                        this.week.classList.remove("text-white");
                        this.week.classList.remove("bg-secondary");
                        this.week.classList.add("bg-transparent");
                        this.week.classList.remove("active");
                    }

                    if (this.month) {
                        this.month.classList.remove("text-white");
                        this.month.classList.remove("bg-secondary");
                        this.month.classList.add("bg-transparent");
                        this.month.classList.remove("active");
                    }

                    if (this.all) {
                        this.all.classList.remove("text-white");
                        this.all.classList.remove("bg-secondary");
                        this.all.classList.add("bg-transparent");
                        this.all.classList.remove("active");
                    }

                    if (this.interval) {
                        this.interval.classList.remove("text-white");
                        this.interval.classList.remove("bg-secondary");
                        this.interval.classList.add("bg-transparent");
                        this.interval.classList.remove("active");
                    }
                }
            });
        }

        if (this.all) {
            this.all.addEventListener("click", () => {
                if (this.all && !this.all.classList.contains("active")) {
                    this.all.classList.add("active");
                    this.all.classList.remove("bg-transparent");
                    this.all.classList.add("bg-secondary");
                    this.all.classList.add("text-white");

                    if (this.today) {
                        this.today.classList.remove("text-white");
                        this.today.classList.remove("bg-secondary");
                        this.today.classList.add("bg-transparent");
                        this.today.classList.remove("active");
                    }

                    if (this.week) {
                        this.week.classList.remove("text-white");
                        this.week.classList.remove("bg-secondary");
                        this.week.classList.add("bg-transparent");
                        this.week.classList.remove("active");
                    }

                    if (this.month) {
                        this.month.classList.remove("text-white");
                        this.month.classList.remove("bg-secondary");
                        this.month.classList.add("bg-transparent");
                        this.month.classList.remove("active");
                    }

                    if (this.year) {
                        this.year.classList.remove("text-white");
                        this.year.classList.remove("bg-secondary");
                        this.year.classList.add("bg-transparent");
                        this.year.classList.remove("active");
                    }

                    if (this.interval) {
                        this.interval.classList.remove("text-white");
                        this.interval.classList.remove("bg-secondary");
                        this.interval.classList.add("bg-transparent");
                        this.interval.classList.remove("active");
                    }
                }
            });
        }

        if (this.interval) {
            this.interval.addEventListener("click", () => {
                if (this.interval && !this.interval.classList.contains("active")) {
                    this.interval.classList.add("active");
                    this.interval.classList.remove("bg-transparent");
                    this.interval.classList.add("bg-secondary");
                    this.interval.classList.add("text-white");

                    if (this.today) {
                        this.today.classList.remove("text-white");
                        this.today.classList.remove("bg-secondary");
                        this.today.classList.add("bg-transparent");
                        this.today.classList.remove("active");
                    }

                    if (this.week) {
                        this.week.classList.remove("text-white");
                        this.week.classList.remove("bg-secondary");
                        this.week.classList.add("bg-transparent");
                        this.week.classList.remove("active");
                    }

                    if (this.month) {
                        this.month.classList.remove("text-white");
                        this.month.classList.remove("bg-secondary");
                        this.month.classList.add("bg-transparent");
                        this.month.classList.remove("active");
                    }

                    if (this.year) {
                        this.year.classList.remove("text-white");
                        this.year.classList.remove("bg-secondary");
                        this.year.classList.add("bg-transparent");
                        this.year.classList.remove("active");
                    }

                    if (this.all) {
                        this.all.classList.remove("text-white");
                        this.all.classList.remove("bg-secondary");
                        this.all.classList.add("bg-transparent");
                        this.all.classList.remove("active");
                    }
                }
            });
        }

        if (this.date_1) {
            this.date_1.addEventListener("click", () => {
                if (this.today) {
                    this.today.classList.remove("text-white");
                    this.today.classList.remove("bg-secondary");
                    this.today.classList.add("bg-transparent");
                    this.today.classList.remove("active");
                }

                if (this.week) {
                    this.week.classList.remove("text-white");
                    this.week.classList.remove("bg-secondary");
                    this.week.classList.add("bg-transparent");
                    this.week.classList.remove("active");
                }

                if (this.month) {
                    this.month.classList.remove("text-white");
                    this.month.classList.remove("bg-secondary");
                    this.month.classList.add("bg-transparent");
                    this.month.classList.remove("active");
                }

                if (this.year) {
                    this.year.classList.remove("text-white");
                    this.year.classList.remove("bg-secondary");
                    this.year.classList.add("bg-transparent");
                    this.year.classList.remove("active");
                }

                if (this.all) {
                    this.all.classList.remove("text-white");
                    this.all.classList.remove("bg-secondary");
                    this.all.classList.add("bg-transparent");
                    this.all.classList.remove("active");
                }
            });
        }

        if (this.date_2) {
            this.date_2.addEventListener("click", () => {
                if (this.today) {
                    this.today.classList.remove("text-white");
                    this.today.classList.remove("bg-secondary");
                    this.today.classList.add("bg-transparent");
                    this.today.classList.remove("active");
                }

                if (this.week) {
                    this.week.classList.remove("text-white");
                    this.week.classList.remove("bg-secondary");
                    this.week.classList.add("bg-transparent");
                    this.week.classList.remove("active");
                }

                if (this.month) {
                    this.month.classList.remove("text-white");
                    this.month.classList.remove("bg-secondary");
                    this.month.classList.add("bg-transparent");
                    this.month.classList.remove("active");
                }

                if (this.year) {
                    this.year.classList.remove("text-white");
                    this.year.classList.remove("bg-secondary");
                    this.year.classList.add("bg-transparent");
                    this.year.classList.remove("active");
                }

                if (this.all) {
                    this.all.classList.remove("text-white");
                    this.all.classList.remove("bg-secondary");
                    this.all.classList.add("bg-transparent");
                    this.all.classList.remove("active");
                }
            });
        }
    }
}
