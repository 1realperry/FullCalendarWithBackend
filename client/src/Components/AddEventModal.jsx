import React, { useState } from "react";
import Modal from "react-modal";
import Datetime from "react-datetime";

export default function ({ isOpen, onClose, onEventAdded }) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());

  const onSubmit = (event) => {
    event.preventDefault();

    onEventAdded({
      title,
      start,
      end,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div>
          <label>Start Date</label>
          <Datetime value={start} onChange={(date) => setStart(date)} />
        </div>
        <div>
          <label>Start End</label>
          <Datetime value={end} onChange={(date) => setEnd(date)} />
        </div>

        <button>Add Event</button>
      </form>
    </Modal>
  );
}
