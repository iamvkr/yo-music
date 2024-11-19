import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { UpdatePlaylistData, UpdateSongData } from '../../db/dexie';
import { getVideoData } from '../../utils/getVideoData';
import { getPlaylistData } from '../../utils/getPlaylistData';

const UpdateModal = ({ mode, selectId }) => {
  const [formData, setformData] = useState(""); /** video link */
  const handleUpdate = async () => {
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
      // update song
      // get songs data from pasted yt video link;
      const data = await getVideoData(formData);
      if (!data) {
        toast.error("Invalid Link!");
        return false;
      }
      const sid = await UpdateSongData(selectId,data);
      if (!sid) {
        toast.error("Failed to update! Song already exist!");
        return false;
      }
      toast.success("Video Updated Successfully");
      setformData("");
      return true;
    }
    //else update playlist
    const data = await getPlaylistData(formData);
    if (!data) {
      toast.error("Invalid Link!");
      return false;
    }
    const pid = await UpdatePlaylistData(selectId,data);
    if (!pid) {
      toast.error("Failed to update! Playlist already exist!");
      return false;
    }
    toast.success("Playlist Updated Successfully");
    setformData("");
    return true;
  }

  return (
    <div>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <dialog id="update_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Update {mode === "songs" ? "Song" : "Playlist"}</h3>
          <p className="py-4">update Youtube {mode === "songs" ? "Video" : "Playlist"} Link</p>
          <input type="text"
            placeholder={mode === "songs" ? "https://youtube.com/watch?v=..." : "https://youtube.com/playlist?list=PLxK..."}
            className="input input-bordered w-full max-w-xs placeholder:text-slate-600"
            value={formData}
            onChange={(e) => { setformData(e.target.value) }}
            />
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn me-4">Close</button>
              <button className="btn" onClick={handleUpdate}>Update</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default UpdateModal