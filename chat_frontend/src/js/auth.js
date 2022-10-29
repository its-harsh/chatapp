import { API_BASE_URL } from "./settings";
import { APIUtils } from "./api-utils";
export class Auth {
    static async login(username, password) {
        let response = await APIUtils.post_api_response(
            `auth/login/`,
            {'Content-Type': 'application/json'},
            {'username': username, 'password': password}
        );
        if (response !== null) {
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('username', response.username);
            return true;
        }
        return false;
    }

    static async register(username, email, password) {
        let response = await APIUtils.post_api_response(
            `auth/register/`,
            {'Content-Type': 'application/json'},
            {'username': username, 'email': email, 'password': password}
        );
        if (response !== null) {
            let login_success = this.login(username, password);
            return login_success;
        }
        return false;
    }

    static is_authenticated() {
        if (localStorage.getItem('auth_token'))
            return true;
        return false;
    }

    static get_token() {
        return localStorage.getItem('auth_token');
    }

    static get_user() {
        return localStorage.getItem('username');
    }

    static logout() {
        localStorage.clear();
    }
}