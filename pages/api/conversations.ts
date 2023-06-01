import { NextApiRequest, NextApiResponse } from "next";
import client from "../../utils/database/dbpool"
import { OpenAIModels, OpenAIModelID } from "@/types/openai";


export default async function handleConversations(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === 'PUT'){
        //saveConversation @utils/app/conversation.ts
    } else if(req.method === 'POST'){
        //newConversation @home.tsx
        const newData = await client.query("INSERT INTO conversationhistory(userid, name, model, prompt, temperature, folderId) values($1::uuid,$2,$3,$4,$5,$6::uuid) RETURNING id, name, model, prompt, temperature, folderId",[req.body.userid, req.body.name, req.body.model, req.body.prompt, req.body.temperature, req.body.folderID]);
        const reformattedData = newData.rows.map(({folderid, ...rest}: {folderid: string}) => 
            ({folderId: folderid, ...rest})
        )
        
        const model = OpenAIModels[newData.rows[0].model as OpenAIModelID];
        return res.status(200).json({
            ...reformattedData[0],
            model: model,
            messages: []
        })
    }
}