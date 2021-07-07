import { useState, useEffect } from "react";
import styled from "styled-components";
import db from "../firebase";
import VideocamRounded from "@material-ui/icons/VideocamRounded";
import PhotoCameraRounded from "@material-ui/icons/PhotoCameraRounded";
import EventNoteIcon from "@material-ui/icons/EventNote";
import AssignmentIcon from "@material-ui/icons/Assignment";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import CommentIcon from "@material-ui/icons/Comment";
import ThumbUpOutlinedIcon from "@material-ui/icons/ThumbUpOutlined";
import ShareIcon from "@material-ui/icons/Share";
import SendIcon from "@material-ui/icons/Send";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../reducers/userSlice";
import { selectLoading, selectArticle } from "../reducers/articleSlice";
import { setArticle } from "../reducers/articleSlice";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PostModel from "./PostModel";
import ReactPlayer from "react-player";

const Main = (props) => {
  const [showModel, setShowModel] = useState("close");
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  const articles = useSelector(selectArticle);
  const dispatch = useDispatch();

  useEffect(() => {
    getArticleApi();
  }, []);

  const handleClick = (e) => {
    e.preventDefault();

    if (e.target !== e.currentTarget) {
      return;
    }

    switch (showModel) {
      case "open":
        setShowModel("close");
        break;
      case "close":
        setShowModel("open");
        break;
      default:
        setShowModel("close");
        break;
    }
  };

  const getArticleApi = () => {
    let link;
    db.collection("articles")
      .orderBy("actor.date", "desc")
      .onSnapshot((snapshot) => {
        link = snapshot.docs.map((doc) => doc.data());
        //console.log(link);
        dispatch(setArticle(link));
      });
  };

  return (
    <>
      <Container>
        <ShareBox>
          <div>
            <img src={user.photo} alt="" />
            <button onClick={handleClick} disabled={loading ? true : false}>
              Start a post
            </button>
          </div>
          <div>
            <button>
              <picture>
                <PhotoCameraRounded />
              </picture>
              <span>Photo</span>
            </button>

            <button>
              <picture>
                <VideocamRounded />
              </picture>
              <span>Video</span>
            </button>

            <button>
              <picture>
                <EventNoteIcon />
              </picture>
              <span>Event</span>
            </button>

            <button>
              <picture>
                <AssignmentIcon />
              </picture>
              <span>Write Article</span>
            </button>
          </div>
        </ShareBox>
        {articles.length === 0 ? (
          <NoArticle>There are no articles.</NoArticle>
        ) : (
          <Content>
            {loading && (
              <FontAwesomeIcon
                class="fa fa-pulse"
                icon={faSpinner}
                style={{ width: "25px", color: "#0066ff" }}
              />
            )}
            {articles.length > 0 &&
              articles.map((article, key) => (
                <Article key={key}>
                  <SharedActor>
                    <a>
                      <img src={article.actor.image} alt="" />
                      <div>
                        <span>{article.actor.title}</span>
                        <span>{article.actor.description}</span>
                        <span>
                          {article.actor.date.toDate().toLocaleDateString()}
                        </span>
                      </div>
                    </a>
                    <button>
                      <picture>
                        <MoreHorizIcon />
                      </picture>
                    </button>
                  </SharedActor>
                  <Description>-{article.description}</Description>
                  <SharedImg>
                    <a>
                      {article.video ? (
                        <ReactPlayer width={"100%"} url={article.video} />
                      ) : article.sharedImg ? (
                        <img src={article.sharedImg} alt="" />
                      ) : article.description ? (
                        <Description />
                      ) : null}
                    </a>
                  </SharedImg>
                  <SocialCounts>
                    <Description>-{article.description}</Description>
                    <SharedImg>
                      <a>
                        {article.video ? (
                          <ReactPlayer width={"100%"} url={article.video} />
                        ) : article.sharedImg ? (
                          <img src={article.sharedImg} alt="" />
                        ) : article.description ? (
                          <Description />
                        ) : null}
                      </a>
                    </SharedImg>
                    <SocialCounts>
                      {/**Its HardCoded..thats why i wont include them. */}
                      {/*<li>
                      <button>
                        <picture>
                          <RateReviewIcon />
                        </picture>
                        <span>75</span>
                      </button>
                    </li>
                    <li>
                      <a>2 Comments</a>
                    </li>*/}
                    </SocialCounts>
                  </SocialCounts>

                  <SocialActions>
                    <button>
                      <picture>
                        <ThumbUpOutlinedIcon />
                      </picture>
                      <span>Like</span>
                    </button>

                    <button>
                      <picture>
                        <CommentIcon />
                      </picture>
                      <span>Comment</span>
                    </button>

                    <button>
                      <picture>
                        <SendIcon />
                      </picture>
                      <span>Send</span>
                    </button>

                    <button>
                      <picture>
                        <ShareIcon />
                      </picture>
                      <span>Share</span>
                    </button>
                  </SocialActions>
                </Article>
              ))}
          </Content>
        )}
        <PostModel showModel={showModel} handleClick={handleClick} />
      </Container>
    </>
  );
};
export default Main;

const Container = styled.div`
  grid-area: main;
`;

const CommonCard = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 5px;
  position: relative;
  border: none;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
`;

const ShareBox = styled(CommonCard)`
  display: flex;
  flex-direction: column;
  color: #958b7b;
  margin: 0 0 8px;
  background: white;
  div {
    button {
      outline: none;
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
      line-height: 1.5;
      min-height: 48px;
      background: transparent;
      border: none;
      display: flex;
      align-items: center;
      font-weight: 600;
    }
    &:first-child {
      display: flex;
      align-items: center;
      padding: 8px 16px 0 16px;
      img {
        width: 48px;
        border-radius: 50%;
        margin-right: 8px;
      }
      button {
        margin: 4px 0;
        flex-grow: 1;
        border-radius: 35px;
        padding-left: 16px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        background-color: white;
        text-align: left;
        cursor: pointer;
      }
    }
    &:nth-child(2) {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      padding-bottom: 4px;
      button {
        picture {
          margin: 0 5px 0 -2px;
        }
        span {
          color: #70b5f9;
        }
      }
    }
  }
`;

const Article = styled(CommonCard)`
  padding: 0;
  margin: 15px 0;
  overflow: auto; //or...visible
`;

const SharedActor = styled.div`
  padding-right: 40px;
  flex-wrap: nowrap;
  padding: 12px 16px 0;
  margin-bottom: 8px;
  align-items: center;
  display: flex;
  a {
    margin-right: 12px;
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    text-decoration: none;

    img {
      width: 48px;
      height: 48px;
    }
    & > div {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      flex-basis: 0;
      margin-left: 8px;
      overflow: hidden;
      span {
        text-align: left;
        &:first-child {
          font-size: 14px;
          font-weight: 700;
          color: rgba(0, 0, 0, 1);
        }
        &:nth-child(n + 1) {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.6);
        }
      }
    }
  }

  button {
    position: absolute;
    right: 12px;
    top: 0;
    background: transparent;
    border: none;
    outline: none;
  }
`;

const Description = styled.div`
  padding: 0 16px;
  overflow: auto;
  color: rgba(0, 0, 0, 0.9);
  font-size: 14px;
  text-align: left;
`;

const SharedImg = styled.div`
  margin-top: 8px;
  margin-left: 1px;
  width: 99.8%;
  display: block;
  position: relative;
  background-color: #f9fafb;
  img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
`;

const SocialCounts = styled.ul`
  line-height: 1.3;
  display: flex;
  align-items: flex-start;
  overflow: auto;
  margin: 0 9px;
  padding: 8px 0;
  border-bottom: 1px solid #e9e5df;
  list-style: none;
  li {
    margin-right: 5px;
    font-size: 12px;
    button {
      display: flex;
      border: none;
      background-color: white;
    }
  }
`;

const SocialActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0;
  min-height: 40px;
  padding: 4px 8px;
  button {
    display: inline-flex;
    align-items: center;
    padding: 4px 6px;
    color: #0a66c2;
    margin: 0 4px;
    cursor: pointer;
    border: none;
    background-color: white;
    &:hover {
      background-color: #e6faff;
    }
    span {
      margin: 0 4px;
    }
    @media (max-width: 768px) {
      width: 100px;
      margin: 0 5px 5px 5px;
      padding: 0 2px;
      span {
        margin-left: 5px;
      }
    }
  }
  @media (max-width: 768px) {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
`;

const Content = styled.div`
  text-align: center;
  & > img {
    width: 30px;
  }
`;

const NoArticle = styled.p`
  text-align: center;
  font-size: 25px;
`;
