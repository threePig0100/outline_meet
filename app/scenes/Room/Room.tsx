import {observer} from "mobx-react";
import React from "react";
import {client} from "~/utils/ApiClient";
import useStores from "~/hooks/useStores";


type Props = { notFound?: boolean };

async function getToken() {
    const res = await client.get("/room.getToken", {
    });
    // const { room} = useStores();
    // await room.getToken()
}

function Room(props: Props) {
    getToken()
    return (
        <a>{12}</a>
    );
}
export default observer(Room);