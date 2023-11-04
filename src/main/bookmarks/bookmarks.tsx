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
import React, {useEffect, useState} from 'react'
import { db } from '../firebase/firebaseConfig';
import {IoReturnDownBack} from 'react-icons/io5'
import './bookmarks.css'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import EachPost from '../feed/eachpost';
import { useGetDoc, useGetUserDoc } from '../Helpers/hooks';
import SkeletonUi from "../Helpers/skeleton";
import NoContent from "../Helpers/NoContent";

export default function Bookmarks() {
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
    const [post, setPost] = useState([])
    const [bookData, setBookData] = useState([])
    const [loading, setLoading] = useState(true)
    const { getDocument } = useGetDoc();
    const { getUserDoc } = useGetUserDoc();


    const navigate = useNavigate();
    const {
        user: { userRef },
      } = useSelector((state: any) => state.user);
    
    useEffect(() => {
        setLoading(true)
        const getPost = collection(db, "posts");
        const unSubscribe = onSnapshot(getPost, (querySnapShot) => {
          const post = [];
          querySnapShot.forEach((doc) => {
            const postData = doc.data();
            post.push(postData);
            
          });
          setPost([...post]);
        });
        return () => {
          unSubscribe();
        };
      }, []);

      useEffect(() => {
        setLoading(true)
        let bookmark = [];
        if (post.length > 0) {
            bookmark =  post.filter((book)=>{
                 return book.bookmarks.indexOf(userRef) !== -1;
              })   
              setBookData(bookmark)
              setLoading(false);      
            }
          
      },[post]);

      useEffect(() => {
        console.log({post})
        console.log({bookData})
      },[post, bookData]);

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

  return (
    <main>
        <section className="bookmark_top">
            <div className="return" onClick={()=> navigate(-1)}>
            <IoReturnDownBack size={18} color='#543EE0'/>
            </div>
            <div className="title">
            <p className="bookmark_title">Bookmarks</p>
            </div>
            <div className="clear">
                <button className="clear_all">
                    Clear Bookmarks
                </button>
            </div>
        </section>
        <section className='bookmark_main'>
        {loading? 
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
        bookData.length > 0?
        bookData.map((post: any) => {
            return (
              <EachPost
                key={post.id}
                post={post}
                handleLike={handleLike}
                userRef={userRef}
              />
            )
          }):
          <NoContent size={300}/>
        }
        </section>
    </main>
  )
}

