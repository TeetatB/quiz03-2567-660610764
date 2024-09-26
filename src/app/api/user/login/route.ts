import jwt from "jsonwebtoken";

import { DB, readDB } from "@lib/DB";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@lib/Database";

export const POST = async (request: NextRequest) => {
  readDB();
  const body = await request.json();
  const {username, password} = body;
  const usercheck = (<Database>DB).users.find(
    (x)=>(x.username === username || x.password === password)
  );
  if(!usercheck){
    return NextResponse.json(
      {
        ok: false,
        message: "Username or Password is incorrect",
      },
      { status: 400 }
    );
  }

  const token = "Replace this with token creation";

  return NextResponse.json({ ok: true, token });
};
