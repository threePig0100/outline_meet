// server.mjs
import express from "express";
import { AccessToken } from "livekit-server-sdk";

const createToken = () => {
  // if this room doesn't exist, it'll be automatically created when the first
  // client joins
  const roomName = "quickstart-room";
  // identifier to be used for participant.
  // it's available as LocalParticipant.identity with livekit-client SDK
  const participantName = "quickstart-username2";

  const at = new AccessToken("APIRN7cNN67ZwcG", "hgzqrcbcyjytm2FJZq306njCOL3vtBTpS8hWqmLuB2B", {
    identity: participantName,
  });
  at.addGrant({ roomJoin: true, room: roomName });

  return at.toJwt();
};

const app = express();
const port = 4000;

app.get("/getToken", (req, res) => {
  res.send(createToken());
});

app.listen(port, () => {
  // eslint-disable-next-line no-console,no-undef
  console.log(`Server listening on port ${port}`);
});
