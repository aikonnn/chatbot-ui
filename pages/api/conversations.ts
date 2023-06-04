import { NextApiRequest, NextApiResponse } from "next";
import client from "../../utils/database/dbpool"
import { OpenAIModels, OpenAIModelID } from "@/types/openai";


export default async function handleConversations(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === 'PUT'){
        //updateConversation @home.tsx
        //CASES FOR MODELS AND MESSAGES
        if(req.body.field === 'messages') {
            return res.status(401).json({
                error: "unsupported"
            })
        }
        if(req.body.field === 'model') {
            return res.status(401).json({
                error: "unsupported"
            })
        }
        await client.query(`UPDATE conversationhistory SET ${req.body.field} = '${req.body.value}' where id='${req.body.convid}'`);
        return res.status(200).json({
            status: "success"
        })
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

    } else if((req.method === 'DELETE')){
        //TODO: DELETE RELATED MESSAGES
        if(req.body.mode === 'single'){
            const query = "DELETE FROM conversationhistory WHERE id = $1::uuid";
            await client.query(query, [req.body.id]);
        } else if (req.body.mode === 'all'){
            const query = "DELETE FROM conversationhistory WHERE userid = $1::uuid";
            await client.query(query, [req.body.id])
        }
        return res.status(200).json({
            status: "success"
        });
    }
}