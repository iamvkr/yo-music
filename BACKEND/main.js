import { getSearchData } from "./src/api";

export default async ({ req, res, log, error }) => {

    // The req object contains the request data
    if (req.path === "/getSearchResults") {
        // Use res object to respond with text(), json(), or binary()
        const keyword = req.query.q;
        const data = await getSearchData(keyword, 10);
        if (!data) {
            return res.json({ ok: false, message: "Error getting Data!" })
        }
        return res.status(200).json({ ok: true, data })
    }

    //   default path /
    return res.json({
        ok:true,
        message:"welcome"
    });
};