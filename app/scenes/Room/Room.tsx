import {observer} from "mobx-react";
import * as React from "react";
import { AccessToken } from "livekit-server-sdk";
import Storage from "@shared/utils/Storage";
import useStores from "~/hooks/useStores";
import axios from "axios";
import {
    ControlBar,
    GridLayout,
    LiveKitRoom,
    ParticipantTile,
    RoomAudioRenderer,
    useTracks
} from "@livekit/components-react";
import {RoomEvent,Track} from "livekit-client";
import '@livekit/components-styles';
import Router from "koa-router";
import LoadingIndicator from "~/components/LoadingIndicator";


import {useEffect, useState} from "react";

type Props = { notFound?: boolean };
const serverUrl = "wss://treepig-xfr1lc4a.livekit.cloud"
interface Room {
    sid: string;
    name: string;
    emptyTimeout: number;
    maxParticipants: number;
    creationTime: string;
    turnPassword: string;
    enabledCodecs: Array<{ mime: string; fmtpLine: string }>;
    metadata: string;
    numParticipants: number;
    numPublishers: number;
    activeRecording: boolean;
}

function Room(props: Props) {
    const [roomList, setRooms] = useState<Room[]>([]);
    const [token, setToken] = useState("");
    const [roomName, setRoomName] = useState(""); // 新增的 state
    const router = new Router();
    const [loading, setLoading] = useState(false);
    const handleGenerateRoom = () => {
        // rooms.createRoom().then(r => {})
        axios.post('http://localhost:4000/createRoom', {roomName}) // 修改的 axios 请求
            .then(function (response: { data: any; }) {
                getRooms(); // 创建房间成功后刷新房间列表
            })
            .catch(function (error: any) {
                console.log(error);
            });
    }
    const getToken = (roomName: string) => {
        const participantName = Storage.get("AUTH_STORE").user.name;
        axios.post('http://localhost:4000/getToken', {roomName,participantName})
            .then(function (response: { data: any; }) {
                console.log(response.data);
                setToken(response.data);
            })
            .catch(function (error: any) {
                console.log(error);
            });
    };
    const getRooms = () => {
        axios.get('http://localhost:4000/listRoom')
            .then(function (response: { data: any; }) {
                setRooms(response.data);
                console.log(response.data);
            })
            .catch(function (error: any) {
                console.log(error);
            });
    }
    useEffect(() => {
        getRooms(); // Call roomList on component mount

    }, []);
    return (
        <div>
            <input type="text" style={{marginTop: '20px'}} value={roomName} onChange={e => setRoomName(e.target.value)}/> {/* 新增的输入框 */}
            <button onClick={handleGenerateRoom}>创建房间</button>
            <table>
                <thead>
                <tr>
                    <th style={{textAlign: 'center',width:'100px'}}>序号</th>
                    <th style={{textAlign: 'center',width:'100px'}}>房间名</th>
                </tr>
                </thead>
                <tbody style={{display: 'block', maxHeight: '200px', overflowY: 'auto'}}>
                {roomList.map((room, index) => (
                    <tr key={index} onClick={
                        () => {getToken(room.name);setLoading(true);
                        }
                    }
                        style={{display: 'table', width: '100%'}}>
                        <td style={{textAlign: 'center'}}>{index + 1}</td>
                        <td style={{textAlign: 'center'}}>{room.name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div>
                {loading && <LoadingIndicator />}
                {token && (
                    <LiveKitRoom
                        onDisconnected={() => {
                            console.log("disconnected")
                            setToken("")
                        }}
                        onConnected={() => {
                            console.log("connected")
                            setLoading(false)
                        }}
                        video={true}
                        audio={true}
                        token={token}
                        serverUrl={serverUrl}
                        data-lk-theme="default"
                        style={{height: '100vh'}}
                    >
                        <MyVideoConference/>
                        <RoomAudioRenderer/>
                        <ControlBar/>
                    </LiveKitRoom>
                )}
            </div>
        </div>
    );
}

function MyVideoConference() {
    // `useTracks` returns all camera and screen share tracks. If a user
    // joins without a published camera track, a placeholder track is returned.
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false },
    );
    return (
        <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
            {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
            <ParticipantTile />
        </GridLayout>
    );
}

export default observer(Room);