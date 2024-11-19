import Dexie from 'dexie';

export const db = new Dexie('myDatabase');
db.version(1).stores({
    songs: 'sid', // Primary key and indexed props
    playlists: 'pid', // Primary key and indexed props
    recentSearchVideos: 'sid', // Primary key and indexed props
});

/** SONGS SERVICES */
// Add a song data:
export const AddSongData = async (data = {}) => {
    try {
        const id = await db.songs.add(data);
        return id;
    } catch (error) {
        return false;
    }
}

// get  all songs data:
export const GetSongData = async () => {
    try {
        const songs = await db.songs.toArray();
        return songs;
    } catch (error) {
        return false;
    }
}

// update a songs:
export const UpdateSongData = async (sid, data) => {
    try {
        await db.songs.update(sid, data);
        return true;
    } catch (error) {
        return false;
    }
}

// delete a songs:
export const DeleteSongData = async (sid) => {
    try {
        await db.songs.delete(sid);
        return true;
    } catch (error) {
        return false;
    }
}

/** ================================================== */
/** PLAYLIST SERVICES */
// Add a Playlist:
export const AddPlaylistData = async (data = {}) => {
    try {
        const id = await db.playlists.add(data);
        // const id = await db.playlists.add({
        //     ...data,
        //     id: Date.now(),
        // });
        return id;
    } catch (error) {
        return false;
    }
}

// get all Playlist data:
export const GetPlaylistData = async () => {
    try {
        const playlists = await db.playlists.toArray();
        return playlists;
    } catch (error) {
        return false;
    }
}

// update a Playlist:
export const UpdatePlaylistData = async (pid, data) => {
    try {
        await db.playlists.update(pid, data);
        return true;
    } catch (error) {
        return false;
    }
}

// delete a Playlist:
export const DeletePlaylistData = async (pid) => {
    try {
        await db.playlists.delete(pid);
        return true;
    } catch (error) {
        // console.log("ERROR DELETING");
        return false;
    }
}


/** ================================================== */
/** RECENT SEARCH VIDEOS SERVICES */
// Add TO recent search:
export const AddRecentVideoData = async (data = {}) => {
    try {
        const id = await db.recentSearchVideos.add(data);
        return id;
    } catch (error) {
        return false;
    }
}

// get all recent Search Videos data:
export const GetRecentVideosData = async () => {
    try {
        const recentSearchVideos = await db.recentSearchVideos.toArray();
        return recentSearchVideos;
    } catch (error) {
        return false;
    }
}

// delete a recent Search Videos:
export const DeleteRecentVideoData = async (sid) => {
    try {
        await db.recentSearchVideos.delete(sid);
        return true;
    } catch (error) {
        // console.log("ERROR DELETING");
        return false;
    }
}