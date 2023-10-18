import { Activity, Book1, Lovely, MessageNotif, ProfileCircle, Send } from 'iconsax-react'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ReactTimeAgo from 'react-time-ago'
import { useGetDoc } from '../Helpers/hooks'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/firebaseConfig'
import { useSelector } from 'react-redux'

export default function FullFeed() {
    let {state: {post}} = useLocation()
    const { getDocument } = useGetDoc();
  // const {getUserDoc} = useGetUserDoc();
  const [isComment, setIsComment] = useState(false);
  const [comment, setComment] = useState("");
  const {
    user: { userRef },
  } = useSelector((state: any) => state.user);


  const handleComment = (e: React.FormEvent<HTMLInputElement>) => {
    setComment(e.currentTarget.value);
    console.log({ comment });
  };
  const handleIsComment = async (post: any, comment: string) => {
    try {
      const { postDoc, postRef } = await getDocument(post.id);
      // const {userDoc, userCollectionRef} = await getUserDoc(userRef)
      const userRefs = doc(db, "users", userRef);
      if (comment && postRef) {
        await updateDoc(postRef, {
          comments: arrayUnion(comment),
        });
        await updateDoc(userRefs, {
          comments: arrayUnion(comment),
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
  return (
    <main className="post" key={post.id}>
    <section className="feed_head">
      <div className="image_container">
        {/* <img src="" alt="" /> */}
        <ProfileCircle size="75" />
      </div>
      <div className="image_profile">
        <div className="profile_name">{post.name}</div>
        <div className="profile_desc">
         <p>product designer{" "}</p> 
          <span className="profile_time">
            {post.createdAt && (
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
    <section className="profile_body">
      {
        <p>{post.body}</p>
      }
    </section>
    <section className="profile_info">
      <div className="profile_comment">
        <span className="info_icon" onClick={() => setIsComment(true)}>
          <MessageNotif size="30" />
        </span>
        {post.comments ? post?.comments?.length : 0}
      </div>
      <div className="profile_likes">
        <span
          className="info_icon like"
        //   onClick={() => handleLike(post)}
          style={
            post.likedBy.filter((p: string) => p === userRef).length > 0
              ? { color: "red" }
              : undefined
          }
        >
          <Lovely size="30" />
        </span>
        {post.likes}
      </div>
      <div className="profile_views">
        <span className="info_icon">
          <Activity size="30" />
        </span>
        {post.views} views
      </div>
    </section>
    {isComment && (
      <section className="comment_sec">
        <ul className="comment_lists">
          {post.comments
            ? post.comments.map((com) => {
                return (
                  <li className="com_list" key={com}>
                    <span className="com_image">
                      {" "}
                      <ProfileCircle size="22" />
                    </span>
                    <div className="com_info">
                      <span className="com_name">{post.name}</span>
                      <span className="com_main">{com}</span>
                    </div>
                    <span className="com_like">
                      {" "}
                      <Lovely size="20" />
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
            onClick={() => handleIsComment(post, comment)}
          >
            <Send size="18" color="white" />
          </button>
        </div>
      </section>
    )}

    <hr className="post_line" />
  </main>
  )
}
