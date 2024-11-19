import React from 'react'
import toast from 'react-hot-toast';
import { DeletePlaylistData, DeleteSongData } from '../../db/dexie';

const DeleteModal = ({ mode, selectId }) => {
    const handleDelete = async () => {
        if (mode === "songs") {
            // delete video
            await DeleteSongData(selectId);
            toast.success("Video Deleted Successfully")
            return true;
        }
        // add playlist
        await DeletePlaylistData(selectId);
        toast.success("Playlist Deleted Successfully")
    }
    return (
        <div>
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <dialog id="delete_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Delete {mode === "songs" ? "Song" : "Playlist"}</h3>
                    <p className="py-4">Are you sure to delete this {mode === "songs" ? "Video" : "Playlist"} ?</p>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn me-4">Close</button>
                            <button className="btn" onClick={handleDelete}>Delete</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    )
}

export default DeleteModal