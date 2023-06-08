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
        } if(req.body.field === 'folderId'){
            if(req.body.value === 0){
                await client.query(`UPDATE conversationhistory SET folderid = uuid_nil() where id=$1`, [req.body.convid]);
            } else {
                await client.query(`UPDATE conversationhistory SET folderid = $1 where id=$2`, [req.body.value, req.body.convid]);
            }

            return res.status(200).json({
                status: "success"
            });
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
            const query1 = "DELETE FROM conversationhistory WHERE id = $1::uuid";
            const query2 = "DELETE FROM messages WHERE convid = $1::uuid";
            await client.query(query1, [req.body.id]);
            await client.query(query2, [req.body.id]);
        } else if (req.body.mode === 'all'){
            const convList = (await client.query("SELECT id from conversationhistory where userid = $1::uuid",[req.body.id])).rows;

            for(let i = 0; i < convList.length; i++){
                console.log(convList[i].id);
                await client.query("DELETE FROM messages WHERE convid = $1::uuid", [convList[i].id]);
            }
            const query = "DELETE FROM conversationhistory WHERE userid = $1::uuid";
            await client.query(query, [req.body.id])
        }
        return res.status(200).json({
            status: "success"
        });
    }
}