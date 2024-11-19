import React, { useState } from 'react'
import { AddPlaylistData, AddSongData } from '../../db/dexie';
import { getVideoData } from '../../utils/getVideoData';
import toast from 'react-hot-toast';
import { getPlaylistData } from '../../utils/getPlaylistData';

/** This modal handles both add of songs and playlsit */
const AddModal = ({ mode }) => {
    const [formData, setformData] = useState(""); /** video link */
    const handleAdd = async () => {
        /** validations: */
        if (!formData.trim()) {
            toast.error("Value cannot be empty!");
            return false;
        }
        if (!formData.includes("https://")) {
            toast.error("Invalid Link!");
            return false;
        }
        if (mode === "songs") {
            // add songs
            // get songs data from pasted yt video link;
            const data = await getVideoData(formData);
            if (!data) {
                toast.error("Invalid Link!");
                return false;
            }
            const sid = await AddSongData(data);
            if (!sid) {
                toast.error("Failed to add! Song already exist!");
                return false;
            }
            toast.success("Video Added Successfully");
            setformData("");
            return true;
        }
        // else add playlist
        const data = await getPlaylistData(formData);
        if (!data) {
            toast.error("Invalid Link!");
            return false;
        }
        const pid = await AddPlaylistData(data);
        if (!pid) {
            toast.error("Failed to add! Playlist already exist!");
            return false;
        }
        toast.success("Playlist Added Successfully");
        setformData("");
        return true;
    }
    return (
        <div>
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <dialog id="add_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Add {mode === "songs" ? "Song" : "Playlist"}</h3>
                    <p className="py-4">Paste a Youtube {mode === "songs" ? "Video" : "Playlist"} Link</p>
                    <input type="text"
                        placeholder={mode === "songs" ? "https://youtube.com/watch?v=..." : "https://youtube.com/playlist?list=PLxK..."}
                        className="input input-bordered w-full max-w-xs placeholder:text-slate-600"
                        value={formData}
                        onChange={(e) => { setformData(e.target.value) }} />
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn me-4">Close</button>
                            <button className="btn" onClick={handleAdd}>Add</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    )
}

export default AddModal