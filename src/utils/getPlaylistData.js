export const getPlaylistData = async (link) => {
    try {
        const res = await fetch(encodeURI(`https://www.youtube.com/oembed?url=${link}&format=json`));
        if (!res.ok) {
            return false;
        }
        const data = await res.json();
        const { title, html, author_name, author_url, thumbnail_url } = data;
        const div = document.createElement("div")
        div.innerHTML = html;
        const src = new URL(div.children[0].src);
        const queryString = src.search;
        const urlParams = new URLSearchParams(queryString);
        const pid = urlParams.get('list');
        const vid = thumbnail_url.split("/")[4];
        return {
            pid,
            title,
            author_name,
            author_url,
            thumbnails: {
                default: `https://img.youtube.com/vi/${vid}/default.jpg`,
                hqdefault: `https://img.youtube.com/vi/${vid}/hqdefault.jpg`,
                mqdefault: `https://img.youtube.com/vi/${vid}/mqdefault.jpg`,
            },
        };
    } catch (error) {
        return false;
    }
}