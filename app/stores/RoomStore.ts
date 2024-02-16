import Group from "~/models/Group";
import {action} from "mobx";
import {client} from "~/utils/ApiClient";
import {PaginationParams} from "~/types";

type FetchPageParams = PaginationParams & { query?: string };
export default class RoomStore {

    @action
    getToken = async ()=> {
        // console.log("hello world")
        // return await client.post(`/groups.list`, params);
    };
}