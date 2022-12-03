import { Button } from "@mui/material";
import React, { useState } from "react";
import firebase from "firebase/compat/app";
import { storage, db } from "./firebase";
import "./ImageUpload.css";

const ImageUpload = ({ userName }) => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);

  const handleChangeCaption = (e) => {
    setCaption(e.target.value);
  };

  const handleChangeFile = (e) => {
    if (e.target.files[0]) {
      //get the file target.files[0] means.. 'the first file' you actually selected if you select multiple files..

      //setting our state..
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = () => {
    //now uploading to firebase storage
    //creating a refernce in firestore db with path images/_name_
    const upload = storage.ref(`images/${image.name}`).put(image);

    upload.on(
      "state_changed",
      (snapshot) => {
        //for uploading visual logic 0 to 100 % loading...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        // console.log(progress);
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        //when upload function completes...
        storage
          //storage ->go to ref("images").go to image.name child and get the downloadURL.
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            //after gtting the url the uploading/adding to the firestore db to post collection ....
            db.collection("post").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(), //adding timstamp
              caption: caption,
              imageUrl: url,
              username: userName,
            });
            setProgress(0);
            setCaption("");
            setImage(null);

            alert("Upload Successfully!!");
          });
      }
    );
  };

  return (
    <div className="imageUpload">
      <h3>Upload</h3>
      <input
        type="text"
        value={caption}
        placeholder="Enter a Caption"
        onChange={handleChangeCaption}
      />
      <input type="file" onChange={handleChangeFile} />
      <progress value={progress} max="100" />
      <Button onClick={handleUpload}>Upload Post</Button>
    </div>
  );
};

export default ImageUpload;
