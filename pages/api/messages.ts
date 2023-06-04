import { NextApiRequest, NextApiResponse } from "next";
import client from "../../utils/database/dbpool"


export default async function handleConversations(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === 'POST'){
        const query = "INSERT INTO messages(convid, role, content) values($1::uuid, $2, $3)";
        await client.query(query, [req.body.convid, req.body.role, req.body.content]);
        return res.status(200).json({
            status: "success"
        });
    }

    return res.status(401).json({
        status: "unsupported"
    })
}