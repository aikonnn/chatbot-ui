import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../utils/database/dbpool"
import { OpenAIModels, OpenAIModelID } from "@/types/openai";


export default async function handleUserState(req: NextApiRequest, res: NextApiResponse) {
    if(req.method == 'GET'){
        var ans = await client.query("SELECT apiKey, showChatbar, showPromptbar, selectedConversation from userState where userid=$1", [req.query.userid]);
        if(ans.rows.length === 0){
            //add to table
            await client.query("INSERT INTO userState(userid, apiKey, showChatbar, showPromptbar, selectedConversation) values($1::uuid, '', true, true, NULL)",[req.query.userid]);
            ans = await client.query(`SELECT apiKey, showChatbar, showPromptbar, selectedConversation from userState where userid='${req.query.userid}'`);
        }

        const newData = await client.query("SELECT id, name, model, prompt, temperature, folderId from conversationhistory where userid=$1",[req.query.userid]);
        const reformattedData = newData.rows.map(({folderid, model, ...rest}: {folderid: string, model: string}) => 
            ({folderId: folderid, 
                model: OpenAIModels[model as OpenAIModelID],
                ...rest})
        )

        return res.status(200).json({
            ...ans.rows[0],
            conversationHistory: reformattedData
        })
    } else if(req.method == 'PUT'){
        console.log("called with id " + req.query.userid + " " + req.body.field +" " + req.body.new);
        await client.query(`UPDATE userstate SET ${req.body.field} = '${req.body.new}' where userid='${req.query.userid}'`);
        return res.status(200).json({
            status: "success"
        })
    }
}