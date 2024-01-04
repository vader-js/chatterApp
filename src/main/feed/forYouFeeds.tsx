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

const {
  posts : cachedPosts,
} = useSelector((state: any) => state.reducer.posts);


  const [posts, setPosts] = useState([]);
  const [selected_post, set_selected_post] = useState(post_no);
  const [liked, setLiked] = useState(false);
  const { getDocument } = useGetDoc();
  const { getUserDoc } = useGetUserDoc();
  const [load, setload] = useState(false);
  const [to_view, set_to_view]= useState('')
  const [current_view, set_current_view] = useState('')
  const [prev_view, set_prev_view] = useState('')

 

  

  const dispatch = useDispatch()
  
  useEffect(() => {
    setload(true);
    // setPosts(cachedPosts)
    const getPost = collection(db, "posts");
    const unSubscribe = onSnapshot(getPost, (querySnapShot) => {
      const post = [] as any;
      querySnapShot.forEach((doc) => {
        const postData = doc.data();
        post.push(postData);
      });
      const post_selected = post.sort((a,b)=> b.createdAt - a.createdAt).slice(0, selected_post);
      console.log({post_selected})
      // dispatch(setCachedPosts(post_selected));
      if(JSON.stringify(post_selected) != JSON.stringify(cachedPosts)) {
        dispatch(setCachedPosts(post_selected));
        // console.log({selected_post})
      }
      setload(false);
    });
    return () => {
      unSubscribe();
    };
  }, [post_no, selected_post]);

  useEffect(() => {
    console.log({current_view})
  // set_prev_view(current_view);
  },[current_view]);

  // useEffect(() => {
  //   // set_to_view(inview)
  //   console.log({p_inview})
  //   if(p_inview){ 
  //   const targettedPost = document.getElementById(p_inview)
  //   if(targettedPost){ 
  //     targettedPost?.scrollIntoView({behavior: 'smooth', block: 'start'  });
   
  //     console.log({targettedPost});
  //   }
  // }
  // },[p_inview, posts]);


  // useEffect(() => {
  //   return ()=>{
  //     console.log("Cleanup - current_view:", current_view);
  //     set_prev_view(current_view);
  //     console.log("Cleanup - prev_view:", prev_view);
  //     dispatch(PrevInview(prev_view))
  //   }
  // },[current_view, dispatch]);


  useEffect(() =>{
    return ()=>{
      add_inview()
    }
  },[])

  const add_inview = () =>{
    dispatch(updateInview(current_view))
  }
  // const updateCurrentView = async () => {
  //   try {
  //     await updateDoc(doc(db, 'users', userRef), {
  //       current_view: current_view,
  //     });
  //   } catch (error) {
  //     console.error("Error updating current_view:", error);
  //   }
  // };

//   useEffect(() => {    
//     const targettedPost = document.getElementById('170179953038033112746580382213')
//     if (targettedPost) {
//       targettedPost.scrollIntoView({ behavior: 'smooth', block: 'start' });
//       targettedPost.classList.add('currentView')
//       setTimeout(()=>{
//         targettedPost.classList.remove('currentView')
//       }, 3000)
//     }

// }, []);

useEffect(() =>{
  setPosts(cachedPosts)
  console.log([cachedPosts])
},[cachedPosts]);

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

  const loadMore =() => {
    dispatch(updatePostNo(15))
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
      posts
        ? posts.map((post: any) => {
            return (
              <EachPost
                key={post.id}
                post={post}
                handleLike={handleLike}
                userRef={userRef}
                fullName={fullName}
                profession={profession}
                set_current_view={set_current_view}
                current_view={current_view}
              />
            );
          })
        : null}
    </main>
  );
}


