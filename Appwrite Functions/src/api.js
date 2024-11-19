import { fetch } from 'undici';

const GetYoutubeInitData = async (url,log,error) => {
    let initdata = {};
    let apiToken = null;
    let context = null;
    try {
        const page = await fetch(encodeURI(url));
        const data = await page.text();
        const ytInitData = data.split("var ytInitialData =");
        if (ytInitData && ytInitData.length > 1) {
            const dataInner = ytInitData[1].split("</script>")[0].slice(0, -1);

            if (data.split("innertubeApiKey").length > 0) {
                apiToken = data
                    .split("innertubeApiKey")[1]
                    .trim()
                    .split(",")[0]
                    .split('"')[2];
            }

            if (data.split("INNERTUBE_CONTEXT").length > 0) {
                context = await JSON.parse(
                    data.split("INNERTUBE_CONTEXT")[1].trim().slice(2, -2)
                );
            }

            initdata = await JSON.parse(dataInner);
            return ({ initdata, apiToken, context });
        } else {
            error("cannot_get_init_data");
            return false;
        }
    } catch (error) {
        error("ERROR :: GET YT INIT DATA", error.message);
        return false;
    }
};

const Sanitize = (item) => {
    const videoId = item.videoRenderer.videoId;
    const title = item.videoRenderer.title.runs[0].text;
    const channel_name = item.videoRenderer.longBylineText.runs[0].text;
    const channel_id = item.videoRenderer.longBylineText.runs[0].navigationEndpoint.browseEndpoint.browseId;
    const channel_username = item.videoRenderer.longBylineText.runs[0].navigationEndpoint.browseEndpoint.canonicalBaseUrl;
    const published_time = item.videoRenderer.publishedTimeText.simpleText;
    const duration = item.videoRenderer.lengthText.simpleText;
    const views = item.videoRenderer.viewCountText.simpleText;
    return { videoId, title, channel_name,channel_id, channel_username, published_time, duration, views }
}

export const getSearchData = async (keyword,limit,log,error) => {
    const withPlaylist = false;
    // const limit = 10;
    const youtubeEndpoint = `https://www.youtube.com`;
    let endpoint = `${youtubeEndpoint}/results?search_query=${keyword}`;
    try {
        const page = await GetYoutubeInitData(endpoint,log,error);
        const sectionListRenderer = page.initdata.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer;
        let contToken = {};
        let items = [];

        sectionListRenderer.contents.forEach((content) => {
            if (content.continuationItemRenderer) {
                contToken = content.continuationItemRenderer.continuationEndpoint.continuationCommand.token;
            } else if (content.itemSectionRenderer) {
                content.itemSectionRenderer.contents.forEach((item) => {
                    if (item.channelRenderer) {
                        let channelRenderer = item.channelRenderer;
                        items.push({
                            id: channelRenderer.channelId,
                            type: "channel",
                            thumbnail: channelRenderer.thumbnail,
                            title: channelRenderer.title.simpleText
                        });
                    } else {
                        let videoRender = item.videoRenderer;
                        let playListRender = item.playlistRenderer;

                        if (videoRender && videoRender.videoId) {
                            // items.push(VideoRender(item));
                            items.push(Sanitize(item));
                        }
                        if (withPlaylist) {
                            if (playListRender && playListRender.playlistId) {
                                items.push({
                                    id: playListRender.playlistId,
                                    type: "playlist",
                                    thumbnail: playListRender.thumbnails,
                                    title: playListRender.title.simpleText,
                                    length: playListRender.videoCount,
                                    videos: playListRender.videos,
                                    videoCount: playListRender.videoCount,
                                    isLive: false
                                });
                            }
                        }
                    }
                });
            }
        });
        // const apiToken = page.apiToken;
        // const context = page.context;
        // const nextPageContext = { context: context, continuation: contToken };
        const itemsResult = limit != 0 ? items.slice(0, limit) : items;
        return ({
            items: itemsResult,
            // nextPage: { nextPageToken: apiToken, nextPageContext: nextPageContext }
        });
    } catch (err) {
        error(err.message);
        return false;
    }
};