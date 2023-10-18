// import React from 'react'
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  ProfileCircle,
  Book1,
  MessageNotif,
  Lovely,
  Activity,
  Send,
} from "iconsax-react";
import { db } from "../firebase/firebaseConfig";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetDoc, useGetUserDoc } from "../Helpers/hooks";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";

export default function ForYouFeeds() {
  type Post = {
    body: string;
    bookmark: boolean;
    bookmarks: [];
    id: string;
    likes: number;
    like: boolean;
    comment: [];
    name: string;
    title: string;
    createdAt: string;
    views: number;
  };
  const [posts, getPosts] = useState<Post[]>([]);
  const [liked, setLiked] = useState(false);
  const { getDocument } = useGetDoc();
  const { getUserDoc } = useGetUserDoc();
  const {
    user: { userRef },
  } = useSelector((state: any) => state.user);

  console.log(userRef);
  useEffect(() => {
    const getPost = collection(db, "posts");
    const unSubscribe = onSnapshot(getPost, (querySnapShot) => {
      const post = [] as any;
      querySnapShot.forEach((doc) => {
        const postData = doc.data();
        post.push(postData);
      });
      getPosts([...post]);
    });
    return () => {
      unSubscribe();
    };
  }, []);

  // const handleLike = async (post : any) => {
  //     const postCollectionRef = collection(db, 'posts');
  //     const q = query(postCollectionRef, where('id', '==', post.id));
  //     const querySnapShot = await getDocs(q)
  //     let documentId = ''
  //     if (!querySnapShot.empty){
  //         querySnapShot.forEach((docs)=>{
  //             documentId = docs.id
  //         })
  //     }
  //     const postRef = doc(db, 'posts',documentId);
  //     const postDoc = await getDoc(postRef);

  //             if (postDoc.exists()) {
  //                 let filteredDocs = postDoc.data().likedBy.filter((doc: any) => doc === userRef);
  //                 console.log({ filteredDocs})
  //                 if(filteredDocs.length){
  //                     setLiked(false);
  //                     await updateDoc(postRef, {
  //                         likedBy: arrayRemove(userRef)
  //                     })
  //                     if (postDoc.data().like <= 0){
  //                         return
  //                     }else{
  //                         await updateDoc(postRef, {
  //                             likes: increment(-1)
  //                         })
  //                     }
  //                 }else{
  //                     await updateDoc(postRef,{
  //                         likedBy: arrayUnion(userRef)
  //                     })
  //                     setLiked(true);
  //                          //  update the 'likes' count
  //                          await updateDoc(postRef, {
  //                             likes: increment(1)
  //                         });
  //                 }

  //     }

  // }

  const handleLike = async (post: any) => {
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

  useEffect(() => {
    console.log({ posts });
  }, [posts]);
  return (
    <main>
      {posts
        ? posts.map((post: any) => {
            return (
              <EachPost
                key={post.id}
                post={post}
                handleLike={handleLike}
                userRef={userRef}
              />
            );
          })
        : null}
    </main>
  );
}

function EachPost({ post, handleLike, userRef }: any) {
  const { getDocument } = useGetDoc();
  // const {getUserDoc} = useGetUserDoc();
  const [isComment, setIsComment] = useState(false);
  const [comment, setComment] = useState("");
  console.log({ post });

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
  useEffect(() => {}, []);
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
        {/* Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nemo eos maiores magni doloribus, 
            optio impedit fugiat! Nisi fugiat beatae deleniti consequatur aliquam voluptatem est quibusdam
             illum sint dignissimos! Possimus, neque. */}
        {post.body.split(" ").length > 35 ? (
          <p>
            {post.body.split(" ").slice(0, 35).join(" ")}{" "}
            <Link to="/home/feed" state={{ post }} className="see_more">
              ...see more
            </Link>
          </p>
        ) : (
          <p>{post.body}</p>
        )}
      </section>
      <section className="profile_info">
        <div className="profile_comment">
          <span className="info_icon" onClick={() => setIsComment(true)}>
            <MessageNotif size="18" />
          </span>
          {post.comments ? post?.comments?.length : 0}
        </div>
        <div className="profile_likes">
          <span
            className="info_icon like"
            onClick={() => handleLike(post)}
            style={
              post.likedBy.filter((p: string) => p === userRef).length > 0
                ? { color: "red" }
                : undefined
            }
          >
            <Lovely size="18" />
          </span>
          {post.likes}
        </div>
        <div className="profile_views">
          <span className="info_icon">
            <Activity size="18" />
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
  );
}
