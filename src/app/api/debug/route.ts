import { NextResponse } from "next/server";
import pkg from "@prisma/client";
const { PrismaClient } = pkg as any;

export const maxDuration = 60;

const PASS = "Ali13680%4013680";
const REF = "vxfuocjnqfihtljnrxkd";
const regions = ["us-west-1","us-east-1","us-east-2","ca-central-1","eu-west-1","eu-west-2","eu-west-3","eu-central-1","eu-central-2","eu-north-1","ap-south-1","ap-southeast-1","ap-northeast-1","ap-northeast-2","ap-southeast-2","sa-east-1"];

async function tryRegion(region: string) {
  const url = `postgresql://postgres.${REF}:${PASS}@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true&connect_timeout=3`;
  const client = new PrismaClient({ datasourceUrl: url });
  try {
    await client.$queryRawUnsafe("SELECT 1");
    return { region, success: true };
  } catch (e: any) {
    return { region, success: false, error: (e && e.message ? String(e.message).split("\\n").pop() : String(e)) };
  } finally {
    client.$disconnect().catch(() => {});
  }
}

export async function GET() {
  const results = await Promise.all(regions.map(tryRegion));
  return NextResponse.json({ results });
}
