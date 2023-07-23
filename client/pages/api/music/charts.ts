import type { NextApiRequest, NextApiResponse } from 'next';
import { ZingMp3 } from 'zingmp3-api-full';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MusicResponse<ChartsType>>
) {
  const response = await ZingMp3.getNewReleaseChart();
  return res.status(200).json(response);
}
