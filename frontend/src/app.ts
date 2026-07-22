import './../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './styles/accordion.css';
import './styles/aside.css';
import './styles/auth.css';
import './styles/common.css';
import './styles/incomes-expenses.css';
import './styles/index.css';
import './styles/popup.css';
import './styles/transactions.css';

import {Router} from "./router.js";

class App {
    private router: Router;
    constructor() {
        this.router = new Router();
    }
}
(new App());