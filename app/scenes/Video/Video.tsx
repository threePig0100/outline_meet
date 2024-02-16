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
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2aWRlbyI6eyJyb29tSm9pbiI6dHJ1ZSwicm9vbSI6InF1aWNrc3RhcnQtcm9vbSJ9LCJpYXQiOjE3MDY3MDI2MzEsIm5iZiI6MTcwNjcwMjYzMSwiZXhwIjoxNzA2NzI0MjMxLCJpc3MiOiJBUElSTjdjTk42N1p3Y0ciLCJzdWIiOiJxdWlja3N0YXJ0LXVzZXJuYW1lIiwianRpIjoicXVpY2tzdGFydC11c2VybmFtZSJ9.fRkEjyvwvTaRWpBmkjbA2GphnmmzxQHk84kmDnS5xds"

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
        <div>
            <input type="text" value={token} onChange={handleInputChange} />
            <button onClick={handleButtonClick}>确认</button>

            {showVideo && token && (
                <LiveKitRoom
                    video={true}
                    audio={true}
                    token={token}
                    serverUrl={serverUrl}
                    data-lk-theme="default"
                    style={{ height: '100vh' }}
                >
                    <MyVideoConference />
                    <RoomAudioRenderer />
                    <ControlBar />
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