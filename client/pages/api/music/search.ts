// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { ZingMp3 } from 'zingmp3-api-full';

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { keyword } = req.query;
  const response = await ZingMp3.search(keyword as string);
  res.status(200).json(response);
}
