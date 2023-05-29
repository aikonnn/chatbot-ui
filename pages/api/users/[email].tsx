import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../utils/database/dbpool"


export default async function handleUserID(req: NextApiRequest, res: NextApiResponse) {
    if(req.method == 'GET'){
        const ans = await client.query(`SELECT * from users where email='${req.query.email}'`);
        if(ans.rows.length === 0){
            //add to table
            await client.query("INSERT INTO users(email) values($1)",[req.query.email]);
            const newans = await client.query(`SELECT * from users where email='${req.query.email}'`);
            return res.status(200).json({
                userid: newans.rows[0].id
            })
        } else {
            return res.status(200).json({
                userid: ans.rows[0].id
            })
        }
    }
}