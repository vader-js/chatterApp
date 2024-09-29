// import React from 'react'
import {
  arrayRemove,
  arrayUnion,
  collection,

  increment,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetDoc, useGetUserDoc } from "../Helpers/hooks";
import EachPost from "./eachpost";
import SkeletonUi from "../Helpers/skeleton";

import { updatePostNo } from "../../app/authSlice";
import './feed.css'



export default function ForYouFeeds() {
  // type Post = {
  //   body: string;
  //   bookmark: boolean;
  //   bookmarks: [];
  //   id: string;
  //   likes: number;
  //   like: boolean;
  //   comment: [];
  //   name: string;
  //   title: string;
  //   createdAt: string;
  //   views: number;
  // };

  const { user: { userRef, fullName, profession, post_no},
} = useSelector((state: any) => state.reducer.user);

// const {
//   posts : cachedPosts,
// } = useSelector((state: any) => state.reducer.posts);


  const [posts, setPosts] = useState([]);
  const [selected_post, set_selected_post] = useState([]);
  // const [liked, setLiked] = useState(false);
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
      let current_time = new Date().toString();
      let month_of_like = new Date().getMonth();
      let current_month = ''
      switch (month_of_like) {
        case 0:
          current_month =  'january';
          break;
        case 1:
          current_month = 'february';
          break;
        case 2:
          current_month = 'march';
          break;
        case 3:
          current_month = 'april';
          break;
        case 4:
          current_month = 'may';
          break;
        case 5:
          current_month = 'june';
          break;
        case 6:
          current_month = 'july';
          break;
        case 7:
          current_month = 'august';
          break;
        case 8:
            current_month = 'september';
            break;
        case 9:
          current_month = 'october';
          break;
        case 10:
          current_month = 'november';
          break;
        case 11:
          current_month = 'december';
          break;
      
        default:
          break;
      }


      if (postDoc.exists()) {
        let view_present = postDoc.data().views.filter((_view: any )=> _view.userRef === userRef);
        if(view_present.length <= 0){
          await updateDoc(postRef, {
            views: arrayUnion({
              userRef, current_time, current_month
            })
          })
        }
        let filteredDocs = postDoc
          .data()
          .likedBy.filter((doc: any) => doc.userRef === userRef);
        console.log({ filteredDocs });
        if (filteredDocs.length) {
          // setLiked(false);
          await updateDoc(postRef, {
            // likedBy: arrayRemove(userRef),
            likedBy: arrayRemove({...filteredDocs[0]}),
            likes: increment(-1),
          });
        } else {
          await updateDoc(postRef, {
            // likedBy: arrayUnion(userRef),
            likedBy: arrayUnion({userRef, current_time, fullName, current_month}),
            likes: increment(1),
          });
          // setLiked(true);
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


  // useEffect(() => {
  //   console.log({ posts });
  
  // }, [posts]);

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


