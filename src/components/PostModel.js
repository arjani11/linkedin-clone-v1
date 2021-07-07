import React, { useState } from "react";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import CommentIcon from "@material-ui/icons/Comment";
import ReactPlayer from "react-player";
import { selectUser } from "../reducers/userSlice";
import { useSelector } from "react-redux";
import firebase from "firebase";
import { storage } from "../firebase";
import db from "../firebase";
import { useDispatch } from "react-redux";
import { setLoading } from "../reducers/articleSlice";

const PostModel = (props) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [editorText, setEditorText] = useState("");
  const [shareImage, setShareImage] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [assetArea, setAssetArea] = useState("");

  const handleChange = (e) => {
    const image = e.target.files[0];
    if (image === "" || image === undefined) {
      alert(`Not an image,the file is a ${typeof image}`);
      return;
    }
    setShareImage(image);
  };

  const switchAssetArea = (area) => {
    setShareImage("");
    setVideoLink("");
    setAssetArea(area);
  };

  const reset = (e) => {
    setEditorText("");
    setShareImage("");
    setVideoLink("");
    setAssetArea("");
    props.handleClick(e);
  };

  const payload = {
    image: shareImage,
    video: videoLink,
    description: editorText,
  };

  const postArticleAPI = (e) => {
    dispatch(setLoading(true));
    if (payload.image !== "") {
      const upload = storage.ref(`images/${payload.image}`).put(payload.image);
      upload.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log(`Progress:${progress}%`);
        },
        (error) => console.log(error.code),
        async () => {
          const downloadURL = await upload.snapshot.ref.getDownloadURL();
          db.collection("articles").add({
            actor: {
              description: user.email,
              date: firebase.firestore.Timestamp.now(),
              image: user.photo,
              title: user.displayName,
            },
            video: videoLink,
            sharedImg: downloadURL,
            comments: 0,
            description: editorText,
          });
          dispatch(setLoading(false));
        }
      );
    } else if (payload.video) {
      db.collection("articles").add({
        actor: {
          description: user.email,
          date: firebase.firestore.Timestamp.now(),
          image: user.photo,
          title: user.displayName,
        },
        video: videoLink,
        sharedImg: "",
        comments: 0,
        description: editorText,
      });
      dispatch(setLoading(false));
    } else if (payload.description) {
      db.collection("articles").add({
        actor: {
          description: user.email,
          date: firebase.firestore.Timestamp.now(),
          image: user.photo,
          title: user.displayName,
        },
        comments: 0,
        description: editorText,
      });
      dispatch(setLoading(false));
    }
    reset(e);
  };

  return (
    <>
      {props.showModel === "open" && (
        <Container>
          <Content>
            <Header>
              <h2>Create a post.</h2>
              <button onClick={(e) => reset(e)}>
                <picture>
                  <CloseIcon />
                </picture>
              </button>
            </Header>

            <SharedContent>
              <UserInfo>
                <img src={user.photo} alt="" />
                <span>{user.displayName}</span>
              </UserInfo>
              <Editor>
                <textarea
                  value={editorText}
                  onChange={(e) => setEditorText(e.target.value)}
                  placeholder="What do you want to talk about?"
                  autoFocus={true}
                />
                {assetArea === "image" ? (
                  <UploadImage>
                    <input
                      type="file"
                      accept="image/gif, image/jpeg, image/png"
                      name="image"
                      id="file"
                      onChange={handleChange}
                      style={{ display: "none" }}
                    />
                    <p>
                      <label htmlFor="file">Select an image to share.</label>
                    </p>
                    {shareImage && (
                      <img src={URL.createObjectURL(shareImage)} />
                    )}
                  </UploadImage>
                ) : (
                  assetArea === "media" && (
                    <>
                      <input
                        type="text"
                        placeholder="Please input a video link"
                        value={videoLink}
                        onChange={(e) => setVideoLink(e.target.value)}
                      />
                      {videoLink && (
                        <ReactPlayer width={"100%"} url={videoLink} />
                      )}
                    </>
                  )
                )}
              </Editor>
            </SharedContent>

            <SharedCreation>
              <AttachAssets>
                <AssetButton onClick={() => switchAssetArea("image")}>
                  <picture>
                    <InsertPhotoIcon />
                  </picture>
                  <h6>Post a photo</h6>
                </AssetButton>
                <AssetButton onClick={() => switchAssetArea("media")}>
                  <picture>
                    <VideoLibraryIcon />
                  </picture>
                  <h6>Post a video</h6>
                </AssetButton>{" "}
              </AttachAssets>

              <ShareComment>
                <AssetButton>
                  <picture>
                    <CommentIcon />
                  </picture>
                  <h6>Anyone</h6>
                </AssetButton>
              </ShareComment>
              <PostButton
                disabled={!editorText ? true : false}
                onClick={(e) => postArticleAPI(e)}
              >
                Post
              </PostButton>
            </SharedCreation>
          </Content>
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 200;
  color: black;
  background-color: rgba(0, 0, 0, 0.8);
  animation: fadeIn 0.4s;
`;

const Content = styled.div`
  width: 100%;
  max-width: 552px;
  background-color: white;
  max-height: 90%;
  overflow: initial;
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  top: 32px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: block;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 16px;
  line-height: 1.5px;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    height: 40px;
    width: 40px;
    min-width: auto;
    color: rgba(0, 0, 0, 0.15);
    picture {
      pointer-events: none;
    }
  }
`;

const SharedContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  vertical-align: baseline;
  background: transparent;
  padding: 8px 12px;
`;
const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  svg,
  img {
    width: 40px;
    height: 40px;
    background-clip: content-box;
    border: 2px solid transparent;
    border-radius: 50%;
  }
  span {
    font-weight: 600;
    font-size: 16px;
    line-height: 1.5;
    margin-left: 5px;
  }
`;

const SharedCreation = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 24px 12px 16px;
  @media (max-width: 768px) {
    overflow-x: auto;
    padding: 12px 5px;
  }
`;

const AssetButton = styled.button`
  display: flex;
  align-items: center;
  height: 40px;
  min-width: auto;
  color: rgba(0, 0, 0, 0.5);
  h6 {
    font-size: 10px;
    color: #29293d; //dark grey
  }
`;
const AttachAssets = styled.div`
  align-items: center;
  display: flex;
  padding-right: 5px;
  ${AssetButton} {
    width: 80px;
    margin-left: 1px;
  }
`;

const ShareComment = styled.div`
  padding-left: 0px;
  margin-right: auto;
  /*border-left: 1px solid rgba(0, 0, 0, 0.15);*/
  ${AssetButton} {
    picture {
      margin-right: 5px;
    }
    h6 {
      font-size: 13px;
    }
  }
`;

const PostButton = styled.button`
  min-width: 60px;
  border-radius: 20px;
  padding: 0 16px;
  background: ${(props) => (props.disabled ? "rgba(0, 0, 0, 0.8)" : "#0a66c2")};
  color: ${(props) => (props.disabled ? "rgba(1, 1, 1, 0.2)" : "white")};
  &:hover {
    background: ${(props) =>
      props.disabled ? "rgba(0, 0, 0, 0.08)" : "#004182"};
  }
  @media (max-width: 768px) {
    margin-left: 4px;
  }
`;

const Editor = styled.div`
  padding: 12px 24px;
  textarea {
    width: 100%;
    min-height: 100px;
    resize: none;
  }

  input {
    width: 100%;
    height: 35px;
    font-size: 16px;
    margin-bottom: 20px;
  }
`;

const UploadImage = styled.div`
  text-align: center;
  img {
    width: 100%;
  }
  p {
    margin: 5px 0;
  }
  p > label {
    cursor: pointer;
    background: #fff2e6;
    border: 1px solid #ffccb3;
    padding: 3px 4px;
  }
`;

export default PostModel;
