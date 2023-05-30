import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../utils/database/dbpool"


export default async function handleUserState(req: NextApiRequest, res: NextApiResponse) {
    if(req.method == 'GET'){
        var ans = await client.query("SELECT apiKey, showChatbar, showPromptbar, selectedConversation from userState where userid=$1", [req.query.userid]);
        if(ans.rows.length === 0){
            //add to table
            await client.query("INSERT INTO userState(userid, apiKey, showChatbar, showPromptbar, selectedConversation) values($1::uuid, '', true, true, NULL)",[req.query.userid]);
            ans = await client.query(`SELECT apiKey, showChatbar, showPromptbar, selectedConversation from userState where email='${req.query.userid}'`);
        }

        return res.status(200).json({...ans.rows[0]})
    }
}