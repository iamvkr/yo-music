import express from 'express'
import { getSearchData } from './src/api.js';
import cors from "cors"
import { getTrendingData } from './src/trending.js';
const app = express()
const port = 3000;

app.use(cors());

app.get('/', async (req, res) => {
    res.send('Welcome to YT BACKEND API');
})

app.get('/getSearchResults/', async (req, res) => { 
    // http://localhost:3000/getSearchResults?q=singham+again+song
    const  keyword  = req.query.q;
    console.log("keyword=",keyword,);
    const data = await getSearchData(keyword,10);
    if (!data) {
        return res.status(400).json({ ok: false, message: "Error getting Data!" })
    }
    return res.status(200).json({ ok: true, data })
})

app.get('/trendingSongs/', async (req, res) => { 
    const data = await getTrendingData();
    if (!data) {
        return res.status(400).json({ ok: false, message: "Error getting Data!" })
    }
    return res.status(200).json({ ok: true, data })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})