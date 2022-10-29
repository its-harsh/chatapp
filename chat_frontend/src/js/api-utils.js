import { Auth } from "./auth";
import { API_BASE_URL } from "./settings";

export class APIUtils {
    static get_url(path) {
        return `${API_BASE_URL}/${path}`;
    }
    static async get_api_response(path, headers){
        let url = APIUtils.get_url(path);
        let response = await fetch(url, {method: 'get', headers: headers});
        if (response.ok) {
            let data = await response.json();
            return data;
        }
        return null;
    }
    static async post_api_response(path, headers, payload) {
        let url = APIUtils.get_url(path);
        let response = await fetch(url, {
            method: 'post',
            headers: headers,
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            let data = await response.json();
            return data;
        }
        return null;
    }
}