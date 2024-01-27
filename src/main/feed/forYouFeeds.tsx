// import React from 'react'
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  increment,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetDoc, useGetUserDoc } from "../Helpers/hooks";
import EachPost from "./eachpost";
import SkeletonUi from "../Helpers/skeleton";
import { setCachedPosts } from "../../app/postSlice";
import { PrevInview, updateInview, updatePostNo } from "../../app/authSlice";
import './feed.css'



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

  const { user: { userRef, fullName, profession, post_no, inview, p_inview},
} = useSelector((state: any) => state.reducer.user);

// const {
//   posts : cachedPosts,
// } = useSelector((state: any) => state.reducer.posts);


  const [posts, setPosts] = useState([]);
  const [selected_post, set_selected_post] = useState([]);
  const [liked, setLiked] = useState(false);
  const { getDocument } = useGetDoc();
  const { getUserDoc } = useGetUserDoc();
  const [load, setload] = useState(false);
  const [post_to_display, set_post_to_display] = useState(15)


  const dispatch = useDispatch()
  
  useEffect(() => {
    setload(true);
    const getPost = collection(db, "posts");
    const unSubscribe = onSnapshot(getPost, async (querySnapShot) => {
      const post = [] as any;
      querySnapShot.forEach((doc) => {
        const postData = doc.data(); 
        post.push(postData);
      });
      setPosts(post);
      setload(false);
    });
    return () => {
      unSubscribe();
    };
  }, []);

  useEffect(() => {
    const post_selected = posts.sort((a: any,b: any)=> b.createdAt - a.createdAt).slice(0, post_to_display);
      set_selected_post(post_selected);
    if(post_no > 15){
      const post_select = posts.sort((a: any,b: any)=> b.createdAt - a.createdAt).slice(0, post_to_display);
      const new_posts = posts.sort((a: any,b: any)=> b.createdAt - a.createdAt).slice(0, post_no);
      const difference = new_posts.filter((new_post) => !post_select.includes(new_post))
      set_selected_post(prevSelectedPost => [...prevSelectedPost, ...difference]);
      set_post_to_display(post_no);
    }
  },[posts, post_no]);

  const handleLike = async (post: any) => {
    try {
      const { postDoc, postRef }: any = await getDocument(post.id);
      const { userDoc, userCollectionRef }: any = await getUserDoc(userRef);

      if (postDoc.exists()) {
        let filteredDocs = postDoc
          .data()
          .likedBy.filter((doc: any) => doc === userRef);
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
        const updateUserPost = userPost.map((posts: any) => {
          if (posts.id === post.postedById) {
            const isLiked = posts.likedBy.indexOf(`${userRef}`);
            console.log("isLiked", isLiked);
            if (isLiked !== -1) {
              const likes = posts.likes - 1;
              const likedBySlice = posts.likedBy.slice(isLiked, isLiked + 1);
              const likedBy = posts.likedBy.filter(
                (like: any) => like !== likedBySlice[0]
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

  const loadMore = async () => {
   await dispatch(updatePostNo(15));
   
  }
  return (
    <main className="foryou_main">
      {
      load ?
      <>
        <div className="skeleton">
        <SkeletonUi numRows={4}/>
        </div>
    
        <div className="skeleton">
        <SkeletonUi numRows={4}/>
        </div>
        
        <div className="skeleton">
        <SkeletonUi numRows={4}/>
        </div>
        </>:
      selected_post
        ? selected_post.map((post: any) => {
            return (
              <EachPost
                key={post.id}
                post={post}
                handleLike={handleLike}
                userRef={userRef}
                fullName={fullName}
                profession={profession}
              /> 
            );
          })
       
        : null
        }
      {posts.length != selected_post.length ?  <div className="load_more" onClick={loadMore}>   
        load more post ...
      </div>: null
     }
     
    </main>
  );
}


