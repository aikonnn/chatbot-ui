import { NextApiRequest, NextApiResponse } from "next";
import client from "../../utils/database/dbpool"


export default async function handleConversations(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === 'PUT'){
        //saveConversation @utils/app/conversation.ts
    } else if(req.method === 'POST'){
        //newConversation @home.tsx
        const newData = await client.query("INSERT INTO conversationhistory(userid, name, model, prompt, temperature, folderid) values($1::uuid,$2,$3,$4,$5,$6::uuid) RETURNING *",[req.body.userid, req.body.name, req.body.model, req.body.prompt, req.body.temperature, req.body.folderID]);
        console.log(newData.rows[0]);
        return res.status(200).json({
            id: newData.rows[0].id,
        })
    }
}