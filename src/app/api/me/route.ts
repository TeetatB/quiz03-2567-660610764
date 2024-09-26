import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Teetat Boontham",
    studentId: "660610764",
  });
};
