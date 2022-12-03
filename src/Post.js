import React, { useEffect, useState } from "react";
import "./Post.css";
import Avatar from "@mui/material/Avatar";
import { db } from "./firebase";
import firebase from "firebase/compat/app";
const Post = (props) => {
  const { username, caption, imageUrl } = props.post;
  const { post_id, user } = props;

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const [like, setLike] = useState(false);
  useEffect(() => {
    let unsub;
    if (post_id) {
      unsub = db
        .collection("post")
        .doc(post_id)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snap) => {
          setComments(snap.docs.map((doc) => doc.data()));
        });
    }
    //cleanup
    return () => {
      unsub();
    };
  }, [post_id]);
  const handlePostComment = (e) => {
    e.preventDefault();
    if (!user) {
      return alert("Please Login To Comment");
    }
    db.collection("post").doc(post_id).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
    console.log(comments);
  };
  const handleLike = () => {
    // if (!like) {
    //   db.collection("post").doc(post_id).collection("likes").add({
    //     like: true,
    //   });
    setLike(!like);
  };
  return (
    <div className="post">
      {/* post have a header */}
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt="username"
          src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png"
        />

        <h3>{username}</h3>
      </div>

      {/* image */}
      <img className="post__image" src={imageUrl} alt="post-pic" />
      {like ? (
        <img
          className="post__like"
          src="https://cdn-icons-png.flaticon.com/128/833/833472.png"
          onClick={handleLike}
        />
      ) : (
        <img
          className="post__like"
          src="https://cdn-icons-png.flaticon.com/128/1077/1077035.png"
          onClick={handleLike}
        />
      )}

      {/* username and caption */}
      <h4 className="post__text">
        <strong>{username}</strong> {caption}
      </h4>
      <div className="post__comments">
        <h5>Comments</h5>
        {comments.map((comment) => {
          return (
            <p>
              <strong>{comment.username}</strong> {comment.text}
            </p>
          );
        })}
      </div>

      <form className="post__commentBox">
        <input
          className="post__input"
          type="text"
          value={comment}
          placeholder="Add Comment"
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className="post__button"
          type="submit"
          onClick={handlePostComment}
          disabled={!comment}
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default Post;
