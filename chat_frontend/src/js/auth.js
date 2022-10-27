import { API_BASE_URL } from "./settings";

export class Auth {
    static async login(username, password) {
        let response = await fetch(`${API_BASE_URL}/auth/login/`, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'username': username, 'password': password})
        });
        if (response.ok) {
            let data = await response.json();
            localStorage.setItem('access_token', data.access);
        }
        return response.ok;
    }

    static async register(username, email, password) {
        let response = await fetch(`${API_BASE_URL}/auth/register/`, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'username': username, 'email': email, 'password': password})
        });
        if (response.ok) {
            let login_success = await this.login(username, password);
            return login_success;
        }
        return false;
    }

    static is_authenticated() {
        if (localStorage.getItem('access_token'))
            return true;
        return false;
    }

    static logout() {
        localStorage.clear();
    }
}