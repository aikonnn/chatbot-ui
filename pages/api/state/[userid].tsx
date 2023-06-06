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

        const selectedConversationID = ans.rows[0].selectedconversation;
        var selectedConversation;

        const newData = await client.query("SELECT id, name, model, prompt, temperature, folderId from conversationhistory where userid=$1",[req.query.userid]);
        const reformattedData = await Promise.all(newData.rows.map(async (rawconv: any) => {
            //retrieve messages?

            const query = "SELECT role, content from messages where convid=$1::uuid ORDER BY ts ASC"
            const messages = await client.query(query, [rawconv.id]);

            if(rawconv.id === selectedConversationID){
                selectedConversation = {
                    folderId: rawconv.folderid, 
                    model: OpenAIModels[rawconv.model as OpenAIModelID],
                    messages: messages.rows,
                    id: rawconv.id,
                    name: rawconv.name,
                    temperature: rawconv.temperature
                }
            }

            return ({
                folderId: rawconv.folderid, 
                model: OpenAIModels[rawconv.model as OpenAIModelID],
                messages: messages.rows,
                id: rawconv.id,
                name: rawconv.name,
                temperature: rawconv.temperature
            })
            }
        ))


        return res.status(200).json({
            ...ans.rows[0],
            conversationHistory: reformattedData,
            selectedConversation
        })
    } else if(req.method == 'PUT'){
        if(req.body.field === 'selectedconversation'){
            await client.query(`UPDATE userstate SET selectedconversation = $1::uuid where userid=$2::uuid`,[req.body.new, req.query.userid]);
            return res.status(200).json({
                status: "success"
            })
        }
        console.log("calling this " + req.query.userid)
        //TODO: fix this for userid
        await client.query(`UPDATE userstate SET ${req.body.field} = '${req.body.new}' where userid='${req.query.userid}'`);
        return res.status(200).json({
            status: "success"
        })
    }
}