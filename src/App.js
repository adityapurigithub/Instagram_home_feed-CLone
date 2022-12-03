import { useEffect, useState } from "react";
import { Modal, Typography, Button, Box, Input } from "@mui/material";
import { InstagramEmbed } from "react-social-media-embed";
import { db, auth } from "./firebase";
import Post from "./Post";
import ImageUpload from "./ImageUpload";
import "./App.css";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function App() {
  // const [post, setPost] = useState([
  //   { username: "Aditya", caption: "hi DOPE People..." },
  //   { username: "Elais", caption: "Wassup!!" },
  //   { username: "Thor", caption: "Kida Chote!!" },
  // ]);
  const [post, setPost] = useState([]);

  //using this for material ui modal..to open and close it.
  const [open, setOpen] = useState(false);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null);

  const [openSignIn, setOpenSignIn] = useState(false);

  const [loading, setLoading] = useState("true");
  //useEffect runs only once when the app component is mounted...
  useEffect(() => {
    // onSnapshot listener is like a camera that takes a snapshot on every change(added in ...or anything) in firestore db
    db.collection("post")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapShot) => {
        setPost(
          snapShot.docs.map((doc) => {
            // console.log(doc.id);
            return {
              id: doc.id, //every doc has a id so it can be accessed with doc.id
              post: doc.data(), //for getting the data
            };
          })
        );
        setLoading(false);
      });
  }, []);
  // [] if dependency is empty means run only once ...
  //if it contains something(post,comment,or any)..
  // then useEffect will work when ever changes made on it(post,comment)

  useEffect(() => {
    /*auth.onAuthStateChanged-> is a backend listener...
    that listen to any change happens on auth state.. */

    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user logged in...
        console.log(authUser);
        setUser(authUser);
      } else {
        //user logged out...
        setUser(null);
      }
    });

    //cleanup ....if use Effect fires again so clean up before or detach the previous listener
    return () => {
      return unsubscribe();
    };
  }, [user]); //when every user changes means a new user login

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSignUp = (e) => {
    e.preventDefault();

    //using firebase auth createUserWithEmailAndPassword(E,P)
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: userName,
        });
      })
      .catch((err) => alert(err.message));
    setOpen(false);
  };

  const handleSignOut = () => {
    auth.signOut();
    alert("Signed Out Successfully!!!");
  };

  const handleOpenSignIn = () => {
    setOpenSignIn(true);
  };
  const handleCloseSignIn = () => {
    setOpenSignIn(false);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    //almost same as in case of signup...
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((err) => alert(err.message));

    setOpenSignIn(false);
  };

  return (
    <div className="App">
      <div className="app__header">
        {/* classname using __  know as 'bem' a naming convention for css  */}
        <img
          className="app__headerImage"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1280px-Instagram_logo.svg.png"
          alt="logo"
        />

        {/* modal(material ui) is a pop up used for siging-up-in 
      open and onclose are the porps ,onClose is listening to any click outside 
      the 
      */}
        {user ? (
          <Button onClick={handleSignOut}>Log Out</Button>
        ) : (
          <div className="login__container">
            <Button onClick={handleOpen}>Sign Up</Button>
            <Button onClick={handleOpenSignIn}>Sign In</Button>
          </div>
        )}
        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <form className="app__signUp">
              <Input
                type="text"
                placeholder="User Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={handleSignUp}>
                SignUp
              </Button>
            </form>
          </Box>
        </Modal>

        <Modal open={openSignIn} onClose={handleCloseSignIn}>
          <Box sx={style}>
            <form className="app__signUp">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={handleSignIn}>
                SignIn
              </Button>
            </form>
          </Box>
        </Modal>
      </div>
      {loading ? (
        <h2 style={{ textAlign: "center", height: "100vh" }}>
          Posts Loading Please Wait....
        </h2>
      ) : (
        <>
          <div>
            {user?.displayName ? (
              <ImageUpload userName={user.displayName} />
            ) : (
              <h2>Want To Post Something Cool!!! You Need to Login first</h2>
            )}
          </div>

          <div className="app__body">
            <div className="app__post">
              {post.map(({ post, id }) => {
                return <Post post={post} post_id={id} user={user} />;
              })}
            </div>
            <div className="app__insta">
              <InstagramEmbed
                url="https://www.instagram.com/p/CUbHfhpswxt/"
                width={328}
                captioned
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
