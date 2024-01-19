import {
  Activity,
  Book1,
  Lovely,
  MessageNotif,
  ProfileCircle,
  Send,
} from "iconsax-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import { useGetDoc, useGetUserDoc } from "../Helpers/hooks";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  increment,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { TfiLayoutMenuSeparated } from "react-icons/tfi";
import { Popconfirm } from "antd";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsBookmarks, BsFillBookmarksFill } from "react-icons/bs";
import { updateInview } from "../../app/authSlice";

export default function FullFeed() {
  let {
    state: { post, profileImage, fullName, image},
  } = useLocation();
  const dispatch = useDispatch();
  const { getDocument } = useGetDoc();
  const { getUserDoc } = useGetUserDoc();
  // const {getUserDoc} = useGetUserDoc();
  const [isComment, setIsComment] = useState(false);
  const [comment, setComment] = useState("");
  const [one_post, set_one_post] = useState(null);
  const [liked, setLiked] = useState(false);
  const {
    user: { userRef },
  } = useSelector((state: any) => state.reducer.user);

  useEffect(() => {
    const postCollectionRef = collection(db, "posts");
    const q = query(postCollectionRef, where("id", "==", post.id));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const post_1 = [];
      querySnapshot.forEach((doc) => {
        post_1.push(doc.data());
      });
      set_one_post(...post_1);
    });
  }, []);

  useEffect(() => {
   
    const addView = async ()=>{
      const { postDoc, postRef } = await getDocument(post.id);
      let current_time = new Date().toString();
      try {
        if(postDoc?.exists()){
          let view_present = postDoc.data().views.filter(_view => _view.userRef === userRef);
          console.log('vieewwwwwsssss',postDoc.data().views)
          console.log({view_present})
          if(view_present.length <= 0){
            await updateDoc(postRef, {
              views: arrayUnion({
                userRef, current_time
              })
            })
          }
        }
      }catch (error){
        console.log(error)
      }
    }
    addView()
  },[]);

  useEffect(() =>{
    dispatch(updateInview(post.id));
    console.log('postId', post.id)
  },[post]);

  const handleComment = (e: React.FormEvent<HTMLInputElement>) => {
    setComment(e.currentTarget.value);
  };
  const handleIsComment = async ( comment: string) => {
    try {
      const { postDoc, postRef } = await getDocument(one_post.id);
      const current_time = new Date()
      if (comment && postRef) {
        await updateDoc(postRef, {
          comments: arrayUnion({fullName, comment, current_time}),
        });
        console.log("comment successfully updated");
        setComment("");
      } else {
        console.error("en error updating comment");
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const handleBookmark = async () => {
    try {
      const { postDoc, postRef } = await getDocument(post.id);
      const post_id = post.id;
      if (postDoc.exists()) {
        const current_time = new Date();
        let filteredDocs = postDoc
          .data()
          .bookmarks.filter((doc) => doc.userRef === userRef);
        if (filteredDocs.length) {
          let bookmark_to_remove = filteredDocs[0];
          // console.log({bookmark_time})
          await updateDoc(postRef, {
            bookmarks: arrayRemove(bookmark_to_remove),
          });
        } else {
          await updateDoc(postRef, {
            bookmarks: arrayUnion({ userRef, current_time, post_id }),
          });
        }
      }
    } catch (error) {
      console.log("addbookmark error: " + error);
    }
  };

  const handleLike = async () => {
    try {
      const { postDoc, postRef } = await getDocument(post.id);
      const { userDoc, userCollectionRef } = await getUserDoc(userRef);

      if (postDoc.exists()) {
        let filteredDocs = postDoc
          .data()
          .likedBy.filter((doc) => doc === userRef);
        console.log({ filteredDocs });
        if (filteredDocs.length) {
          setLiked(false);
          await updateDoc(postRef, {
            likedBy: arrayRemove(userRef),
            likes: increment(-1),
          });
        } else {
          await updateDoc(postRef, {
            likedBy: arrayUnion(userRef),
            likes: increment(1),
          });
          setLiked(true);
        }
      }
      if (!userDoc.exists()) {
        console.log("doc does not exist");
        return;
      } else {
        const userPost = userDoc.data().post;
        const updateUserPost = userPost.map((posts) => {
          if (posts.id === post.postedById) {
            const isLiked = posts.likedBy.indexOf(`${userRef}`);
            console.log("isLiked", isLiked);
            if (isLiked !== -1) {
              const likes = posts.likes - 1;
              const likedBySlice = posts.likedBy.slice(isLiked, isLiked + 1);
              const likedBy = posts.likedBy.filter(
                (like) => like !== likedBySlice[0]
              );
              console.log({ likedBy });
              return { ...posts, likes, likedBy };
            } else {
              const likes = posts.likes + 1;
              const likedBy = [...posts.likedBy, userRef];
              return { ...posts, likes, likedBy };
            }
          }
          return posts;
        });
        await updateDoc(userCollectionRef, { post: updateUserPost });
      }
      console.log({ userDoc });
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  return (
    <main className="full_post" key={post.id}>
        <section className="full_header">
          {
            image ?   <img src={image} alt="" /> :   <div className="full_header_dummy"></div>
          }
      
      </section>
      <section className="feed_head">
       
        <div className="image_container">
          {profileImage ? (
            <img src={profileImage} alt="profile" className="post_profile" />
          ) : (
            <ProfileCircle size="75" />
          )}
        </div>
        <div className="image_profile">
          <div className="profile_name">{post.name}</div>
          <div className="profile_desc">
            <p>{post.profession ? post.profession : "redacted"}</p>
            <span className="profile_time">
              {!post.createdAt && (
                <ReactTimeAgo
                  date={post.createdAt.toDate()}
                  locale="en-US"
                  timeStyle="round-minute"
                  className="timestamp"
                />
              )}
            </span>
          </div>
        </div>
      </section>
      <section className="feed_title">
        <h2>{post.title}</h2>
        <div>
          <span>
            <Book1 size="18" />
          </span>
          {Math.round(post.body.split(" ").length / 200) < 1
            ? 1
            : Math.round(post.body.split(" ").length / 200)}{" "}
          mins read
        </div>
      </section>
      <section className="profile_body">{<p>{post.body}</p>}</section>
      <section className="full_profile_info">
        <div className="profile_comment">
          <span className="info_icon" onClick={() => setIsComment(!isComment)}>
            <MessageNotif size="18" />
          </span>
         {
          one_post && (
              one_post?.comments?.length ? one_post?.comments?.length : 0
            
          )
         }
        </div>
        <div className="profile_likes">
          {one_post && (
            <span className="info_icon like" onClick={handleLike}>
              {one_post.likedBy.indexOf(userRef) === -1 ? (
                <AiOutlineHeart size={18} />
              ) : (
                <AiFillHeart color="red" size={18} />
              )}
            </span>
          )}
          {one_post && one_post.likes}
        </div>
        <div className="profile_bookmark">
          {one_post && (
            <span className="info_icon bookmark" onClick={handleBookmark}>
              {one_post.bookmarks.filter(
                (book: any) => book.userRef === userRef
              ).length > 0 ? (
                <BsFillBookmarksFill size={18} color="#543EE0" />
              ) : (
                <BsBookmarks size={18} />
              )}
            </span>
          )}

          {one_post && one_post.bookmarks.length}
        </div>
        <div className="profile_views">
          <span className="info_icon">
            <Activity size="18" />
          </span>
          {one_post && one_post?.views?.length} views
        </div>
      </section>
      {isComment && (
          <section className="comment_sec">
            <ul className="comment_lists">
              {one_post
                ? one_post?.comments?.map((com) => {
                    return (
                      <li className="com_list" key={com.id}>
                        <span className="com_image">
                          {" "}
                          <ProfileCircle size="22" />
                        </span>
                        <div className="com_info">
                          <span className="com_name">{com.fullName}</span>
                          <span className="com_main">{com.comment}</span>
                        </div>
                        <span className="com_like">
                          {" "}
                          <AiOutlineHeart size={18}/>
                        </span>
                      </li>
                    );
                  })
                : null}
            </ul>
            <div className="comment">
              <input
                type="text"
                className="com_input"
                placeholder="comment..."
                value={comment}
                onChange={handleComment}
              />
              <button
                className="send"
                onClick={() => handleIsComment(comment)}
              >
                <Send size="18" color="white" />
              </button>
            </div>
          </section>
        )}

      {/* <hr className="full_post_line" /> */}
    </main>
  );
}
