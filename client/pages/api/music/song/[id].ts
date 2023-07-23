import {NextApiRequest, NextApiResponse} from "next";
import {ZingMp3} from "zingmp3-api-full";

export default async function handler(req: NextApiRequest, res: NextApiResponse<MusicResponse<SongType>>) {
  const { id } = req.query;
  const response = await ZingMp3.getSong(id as string)
  return res.status(200).json(response)
}