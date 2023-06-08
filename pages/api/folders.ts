import { NextApiRequest, NextApiResponse } from "next";
import client from "../../utils/database/dbpool"
import { OpenAIModels, OpenAIModelID } from "@/types/openai";


export default async function handleConversations(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === 'POST'){
        //add to db
        const query = "INSERT into folders(name, type, userid) values($1,$2, $3) returning id";
        const id = await client.query(query, [req.body.name, req.body.type, req.body.userid]);

        return res.status(200).json({
            id: id.rows[0].id
        })
    } if(req.method === 'DELETE'){
        const query = "DELETE from folders where id = $1"
        await client.query(query, [req.body.folderid]);

        return res.status(200).json({
            status: "success"
        })
    } if(req.method === 'PUT'){
        const query = "UPDATE folders SET name = $1 where id = $2";
        await client.query(query,[req.body.name, req.body.id]);

        return res.status(200).json({
            status: "success"
        })
    }
}