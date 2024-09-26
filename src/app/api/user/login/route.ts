import jwt from "jsonwebtoken";

import { DB, readDB } from "@lib/DB";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@lib/Database";

export const POST = async (request: NextRequest) => {
  readDB();
  const body = await request.json();
  const {username, password} = body;
  const user = (<Database>DB).users.find(
    (x)=>(x.username === username || x.password === password)
  );
  if(!user){
    return NextResponse.json(
      {
        ok: false,
        message: "Username or Password is incorrect",
      },
      { status: 400 }
    );
  }

  const secret = process.env.JWT_SECRET || "This is another secret"

  const token = jwt.sign(
    {username: username, password: password, role: user.role},
    secret,
    {expiresIn: "8h"});

  return NextResponse.json({ ok: true, token });
};
