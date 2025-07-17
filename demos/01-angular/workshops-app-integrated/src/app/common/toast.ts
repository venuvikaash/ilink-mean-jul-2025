import { Injectable } from '@angular/core';

interface IToast {
    message: string;
    className: string;
    duration: number;
}

@Injectable({
    providedIn: 'root',
})
export class Toast {
    // shared data - the list of toast messages
    private toasts: IToast[] = [];

    constructor() {}

    getToasts() {
        return this.toasts;
    }

    add(toast: IToast) {
        this.toasts.unshift(toast);
    }

    remove(toast: IToast) {
        // filter() does not modify this.toasts, it only returns a new Array. So we need to reassign the result to this.toasts
        this.toasts = this.toasts.filter((t) => t !== toast);
    }

    clear() {
        this.toasts = [];
    }
}