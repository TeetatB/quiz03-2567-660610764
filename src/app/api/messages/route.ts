import { DB, readDB, writeDB } from "@lib/DB";
import { Database } from "@lib/Database";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  readDB();
  const roomId = nanoid();
  const checkRoomId = (<Database>DB).rooms.find(
    (x)=>(x.roomId === roomId)
  );

  if(!checkRoomId){
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }
  let filtered_message = (<Database>DB).messages;
  
  if(checkRoomId){
    filtered_message = filtered_message.filter(
      (x)=> (x.roomId === roomId)
    );
  }
  return NextResponse.json(
    {
      ok:true,
      message: filtered_message,
    }
  )
};

export const POST = async (request: NextRequest) => {
  readDB();
  const body = await request.json();
  const {roomId,messageText} = body;
  const checkRoomId = (<Database>DB).rooms.find(
    (x)=>(x.roomId === roomId)
  );

  if(!checkRoomId){
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

   const messageId = nanoid();
  //push message into the room with id that we assign
  (<Database>DB).messages.push(
    roomId,
    messageId,
    messageText
  );

  writeDB();

  return NextResponse.json({
    ok: true,
    messageId: messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request: NextRequest) => {
  const payload = checkToken();
  const body = await request.json();
  const {roomId, messageText} = body;

  if(!payload){
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }
  

  readDB();
  const messageId = nanoid();
  const checkmessage = (<Database>DB).messages.find(
    (x)=>(x.messageId === messageId && x.messageText === messageText && x.roomId === roomId) 
  );
  if(!checkmessage){
    return NextResponse.json(
      {
        ok: false,
        message: "Message is not found",
      },
      { status: 404 }
    );
  }

  if(payload && checkmessage){
    (<Database>DB).messages.filter(
      (x)=>(x.messageId === messageId && x.messageText === messageText && x.roomId === roomId)
    );
    writeDB();

    return NextResponse.json({
      ok: true,
      message: "Message has been deleted",
    });
  }

};
