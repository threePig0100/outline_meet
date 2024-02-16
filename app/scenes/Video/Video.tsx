import {observer} from "mobx-react";
import Empty from "~/components/Empty";
import * as React from "react";
import '@livekit/components-styles';
import {
    ControlBar,
    GridLayout,
    LiveKitRoom,
    ParticipantTile,
    RoomAudioRenderer, useTracks,
} from '@livekit/components-react';
import {Track} from "livekit-client";
import {useState} from "react";


type Props = { notFound?: boolean };

const serverUrl = "wss://treepig-xfr1lc4a.livekit.cloud"

function Video(props: Props) {
    const [token, setToken] = useState('');
    const [showVideo, setShowVideo] = useState(false); // 控制视频显示的状态
    const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setToken(event.target.value);
    };

    const handleButtonClick = () => {
        setShowVideo(true); // 点击按钮后显示视频
    };
    return (
        <div style={{marginTop: '20px'}}>
            <p>请输入token以加入房间</p>
            <input type="text" value={token} onChange={handleInputChange}/>
            <button style={{marginLeft: '20px'}} onClick={handleButtonClick}>确认</button>
            {showVideo && token && (
                <LiveKitRoom
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
export default observer(Video);