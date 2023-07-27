import type { NextApiRequest, NextApiResponse } from 'next';
import {ZingMp3} from "zingmp3-api-full";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { id } = req.query;
  const response = await ZingMp3.getLyric(id as string)
  return res.status(200).json(response)
}
