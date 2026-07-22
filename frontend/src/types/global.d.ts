import type { Balance } from "../tools/balance.js";

declare global {
    interface Window {
        balanceInstance?: Balance;
    }
}