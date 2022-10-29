import { APIUtils } from "./api-utils";
import { Auth } from "./auth";

export class Chat {
    static async list_room() {
        let response = await APIUtils.get_api_response(
            `api/list_room/`,
            {'Authorization': `Token ${Auth.get_token()}`}
        )
        if (response !== null) {
            return response;
        }
        return null;
    }
    static async last_message(room_id) {
        let response = await APIUtils.get_api_response(
            `api/last_message/${room_id}/`,
            {'Authorization': `Token ${Auth.get_token()}`}
        )
        if (response !== null) {
            return response;
        }
        return null;
    }
}