import { parse } from 'node-html-parser';

export const getTrendingData = async () => {
    const res = await fetch("https://kworb.net/spotify/country/in_weekly.html");
    const html = await res.text();
    const body = html.substring(
        html.indexOf("body")-1,
        html.lastIndexOf("/body")+6
    );
    
    const document = parse(body);
    const table = document.querySelector("#spotifyweekly");
    const items = table.childNodes[5].childNodes;
    const output = [];
    for (let i = 0; i < items.length; i++) {
        if (items[i].innerText !== "\n") {
            const title = items[i].innerText.split("\n")[2];
            output.push({title});
        }
    }
    return output;
}