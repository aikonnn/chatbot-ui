import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../utils/database/dbpool"
import { OpenAIModels, OpenAIModelID } from "@/types/openai";
import { PluginID, PluginKey } from "@/types/plugin";


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

        const folderData = await client.query("SELECT id, name, type from folders where userid = $1",[req.query.userid]);

        const promptData = await client.query("SELECT id, name, description, content, model, folderid from prompts where userid = $1",[req.query.userid]);
        const reformattedPrompts = await Promise.all(promptData.rows.map(async (rawPrompt: any) => {
            return {
                ...rawPrompt,
                model: OpenAIModels[rawPrompt.model as OpenAIModelID],
                folderId: rawPrompt.folderid
            }
        }))

        var pluginkeys = [];
        const pluginQuery = "SELECT pluginid from plugins where userid = $1";
        const existingPlugins =  await client.query(pluginQuery,[req.query.userid]);

        if(existingPlugins.rows.find((elem: any) => {
            return elem.pluginid === PluginID.GOOGLE_SEARCH;
        })){
            console.log("getting google key!")
            //retrieve google pluginkey
            const googleKeyQuery = "SELECT google_api_key, google_cse_id from googlekeys where userid = $1"
            const keyData = await client.query(googleKeyQuery, [req.query.userid]);

            const newPluginKey: PluginKey = {
                pluginId: PluginID.GOOGLE_SEARCH,
                requiredKeys: [
                  {
                    key: 'GOOGLE_API_KEY',
                    value: keyData.rows[0].google_api_key ? keyData.rows[0].google_api_key : '',
                  },
                  {
                    key: 'GOOGLE_CSE_ID',
                    value: keyData.rows[0].google_cse_id ? keyData.rows[0].google_cse_id  :  '',
                  },
                ],
              };
              pluginkeys.push(newPluginKey);
        }

        return res.status(200).json({
            ...ans.rows[0],
            conversationHistory: reformattedData,
            selectedConversation,
            folders: folderData.rows,
            prompts: reformattedPrompts,
            pluginkeys: pluginkeys,
        })
    } else if(req.method == 'PUT'){
        if(req.body.field === 'selectedconversation'){
            await client.query(`UPDATE userstate SET selectedconversation = $1::uuid where userid=$2::uuid`,[req.body.new, req.query.userid]);
            return res.status(200).json({
                status: "success"
            })
        }
        
        //TODO: fix this for userid
        await client.query(`UPDATE userstate SET ${req.body.field} = '${req.body.new}' where userid='${req.query.userid}'`);
        return res.status(200).json({
            status: "success"
        })
    }
}