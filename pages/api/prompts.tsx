import { NextApiRequest, NextApiResponse } from "next";
import client from "../../utils/database/dbpool"
import { OpenAIModels, OpenAIModelID } from "@/types/openai";


export default async function handlePrompts(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === 'POST'){
        //add to db
        const query = "INSERT into prompts(name, description, content, model, userid) values($1,$2,$3,$4,$5) returning id";
        const id = await client.query(query, [req.body.name, req.body.description, req.body.content, req.body.model, req.body.userid]);

        return res.status(200).json({
            id: id.rows[0].id
        })
    } if(req.method === 'DELETE'){
        const query = "DELETE from prompts where id = $1"
        await client.query(query, [req.body.id]);

        return res.status(200).json({
            status: "success"
        })
    } if(req.method === 'PUT'){
        const query = "UPDATE prompts SET name = $1, description = $2, content = $3, model = $4, folderid = $5 where id = $6";
        await client.query(query,[req.body.name, req.body.description, req.body.content, req.body.model, req.body.folderid, req.body.id]);

        return res.status(200).json({
            status: "success"
        })
    }
}