export const getVideoData = async (link) => {
    try {
        const res = await fetch(encodeURI(`https://www.youtube.com/oembed?url=${link}&format=json`));
        if (!res.ok) {
            return false;
        }
        const data = await res.json();
        const { title, author_name, author_url,thumbnail_url,html } = data;
        if (html.includes("videoseries")) { // check if link was of a playlist
            return false; //link was of playlist so not allowed
        }
        const vid = thumbnail_url.split("/")[4];
        return {
            sid: vid,
            title,
            thumbnails: {
                default: `https://img.youtube.com/vi/${vid}/default.jpg`,
                hqdefault: `https://img.youtube.com/vi/${vid}/hqdefault.jpg`,
                mqdefault: `https://img.youtube.com/vi/${vid}/mqdefault.jpg`,
            },
            author_name,
            author_url
        }
    } catch (error) {
        return false;
    }
}