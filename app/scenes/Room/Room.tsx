import {observer} from "mobx-react";
import React, {useState} from "react";
import { AccessToken } from "livekit-server-sdk";
import Storage from "@shared/utils/Storage";
import useStores from "~/hooks/useStores";

type Props = { notFound?: boolean };

const createToken = () => {
    const roomName = "quickstart-room";
    const participantName = Storage.get("AUTH_STORE").user.name;
    const at = new AccessToken("APIRN7cNN67ZwcG", "hgzqrcbcyjytm2FJZq306njCOL3vtBTpS8hWqmLuB2B", {
        identity: participantName,
    });
    at.addGrant({ roomJoin: true, room: roomName });
    return at.toJwt();
};

function Room(props: Props) {
    const [token, setToken] = useState("");
    const { room } = useStores();
    const handleGenerateToken = () => {
        createToken().then((token) => {
            return setToken(token);
        });
    }
    const handleGenerateRoom = () => {
        console.log(room)
        room.createRoom().then(r => {})
    }

    return (
        <div>
            <p>该页面用于选择或创建Room</p>
            <button onClick={handleGenerateToken}>生成Token</button>
            <button onClick={handleGenerateRoom}>创建房间</button>
            <div style={{marginTop: '20px'}}>
                {token && <textarea cols={80} rows={5} readOnly value={token}/>}
            </div>
        </div>
    );
}

export default observer(Room);