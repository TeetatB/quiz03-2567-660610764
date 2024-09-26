import { DB, readDB, writeDB} from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

import {Database} from "@lib/Database"
export const GET = async () => {
  readDB();
  return NextResponse.json({
    ok: true,
    rooms: (<Database>DB).rooms,
    // totalRooms: 
  });
};

export const POST = async (request: NextRequest) => {
  const payload = checkToken();
  const body = await request.json();
  const {roomName} = body;
  if(!payload) {
  return NextResponse.json(
    {
      ok: false,
      message: "Invalid token",
    },
    { status: 401 }
  ); 
  }

  readDB();
  const roomId = nanoid();

  const checkRoom = (<Database>DB).rooms.find(
    (x)=>(x.roomId === roomId && x.roomName === roomName)
  );

  if(checkRoom) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${roomName} already exists`,
      },
      { status: 400 }
    );
  }
  
  (<Database>DB).rooms.push({
      roomId,
      roomName
  });
  
  //call writeDB after modifying Database
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId: roomId,
    message: `Room ${roomName} has been created`,
  });

};
