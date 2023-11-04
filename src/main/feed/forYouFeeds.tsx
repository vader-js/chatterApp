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
import {BsBookmarks, BsFillBookmarksFill} from 'react-icons/bs'
import {AiOutlineHeart, AiFillHeart} from 'react-icons/ai'
import { db } from "../firebase/firebaseConfig";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetDoc, useGetUserDoc } from "../Helpers/hooks";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import EachPost from "./eachpost";



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
  const [posts, setPosts] = useState<Post[]>([]);
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
      setPosts([...post]);
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


