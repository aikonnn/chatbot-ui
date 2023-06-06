import { NextApiRequest, NextApiResponse } from "next";
import client from "../../utils/database/dbpool"


export default async function handleConversations(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === 'POST'){
        console.log(req.body.convid);
        console.log(req.body.role);
        console.log(req.body.content);
        const query = "INSERT INTO messages(convid, role, content) values($1::uuid, $2, $3)";
        await client.query(query, [req.body.convid, req.body.role, req.body.content]);
        return res.status(200).json({
            status: "success"
        });
    } if(req.method === 'DELETE'){
        const query = "SELECT id, role from messages where convid = $1::uuid";
        const messageIDS = (await client.query(query, [req.body.convid])).rows;
        console.log(req.body.convid);
        console.log(req.body.index);
        console.log(messageIDS[req.body.index]);
        console.log(messageIDS[req.body.index + 1]);

        if (
            req.body.index < messageIDS.length - 1 &&
            messageIDS[req.body.index + 1].role === 'assistant'
          ) {
            //remove 2
            const delquery = "DELETE from messages where id in ($1::uuid, $2::uuid)";
            await client.query(delquery, [messageIDS[req.body.index].id, messageIDS[req.body.index + 1].id])
          } else {
            //remove 1
            const delquery = "DELETE from messages where id = $1::uuid";
            await client.query(delquery, [messageIDS[req.body.index].id])
          }

          return res.status(200).json(
            {
                status: "success"
            }
          );
    }

    return res.status(401).json({
        status: "unsupported"
    })
}