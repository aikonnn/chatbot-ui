import { NextApiRequest, NextApiResponse } from "next";
import client from "../../utils/database/dbpool";
import { PluginID, PluginKey, PluginName } from "@/types/plugin";


export default async function handlePlugins(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === 'POST'){
        const addKeyQuery = "INSERT into plugins(userid, pluginid) values($1, $2)";
        await client.query(addKeyQuery, [req.body.userid, req.body.pluginid]);
        if(req.body.pluginid === PluginID.GOOGLE_SEARCH){
            const addGoogleKeys = "INSERT into googlekeys(userid, google_api_key, google_cse_id) values ($1, $2, $3)";
            await client.query(addGoogleKeys, [req.body.userid, req.body.requiredKeys[0].value, req.body.requiredKeys[1].value]);

            return res.status(200).json({
                status: "success"
            })
        }  else {
            return res.status(401).json({
                error: "unsupported"
            })
        }
    } else if(req.method === 'PUT'){
        if(req.body.pluginid === PluginID.GOOGLE_SEARCH){
            const updateGoogleKeys = "UPDATE googlekeys SET google_api_key = $1, google_cse_id = $2 WHERE userid = $3";
            await client.query(updateGoogleKeys, [req.body.requiredKeys[0].value, req.body.requiredKeys[1].value, req.body.userid]);
            
            return res.status(200).json({
                status: "success"
            })
        } else {
            return res.status(401).json({
                error: "unsupported"
            })
        }
    } else if(req.method === 'DELETE'){
        if(req.body.pluginid === PluginID.GOOGLE_SEARCH){
            const deleteGoogleKeys = "DELETE from googlekeys where userid = $1";
            const deletePlugin = "DELETE from plugins where userid = $1 AND pluginid = $2";
            await client.query(deleteGoogleKeys, [req.body.userid]);
            await client.query(deletePlugin, [req.body.userid, req.body.pluginid]);

            return res.status(200).json({
                status: "success"
            })
        } else {
            return res.status(401).json({
                error: "unsupported"
            })
        }
    }
}