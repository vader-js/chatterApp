import {
    arrayRemove,
    arrayUnion,
    collection,
    getDocs,
    increment,
    onSnapshot,
    updateDoc,
  } from "firebase/firestore";
import {useEffect, useState} from 'react'
import { db } from '../firebase/firebaseConfig';
import {IoReturnDownBack} from 'react-icons/io5'
import './bookmarks.css'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetDoc, useGetUserDoc } from '../Helpers/hooks';
import SkeletonUi from "../Helpers/skeleton";
import NoContent from "../Helpers/NoContent";
// import confirm from "antd/es/modal/confirm";
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal} from 'antd';
import EachPostOthers from "../feed/eachPostOthers";

const { confirm } = Modal;

export default function Bookmarks() {
    interface Post {
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
    const [post, setPost] = useState<Post[] | []>([])
    const [bookData, setBookData] = useState<any | []>([])
    // const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(true)
    const { getDocument } = useGetDoc();
    const { getUserDoc } = useGetUserDoc();


    const navigate = useNavigate();
    const {
        user: { userRef },
      } = useSelector((state: any) => state.reducer.user);
    
    useEffect(() => {
        setLoading(true)
        const getPost = collection(db, "posts");
        const unSubscribe = onSnapshot(getPost, (querySnapShot) => {
          const post : Post[]= [];
          querySnapShot.forEach((doc) => {
            const postData: any = doc.data();
            post.push(postData);
            
          });
          setPost([...post]);
        });
        return () => {
          unSubscribe();
        };
      }, []);

      // useEffect(() => {
      //   setLoading(true)
      //   let bookmark = [];
      //   if (post.length > 0) {
      //       bookmark =  post.filter(bookmark => bookmark.bookmarks.some(_book=> _book.userRef === userRef))
      //         console.log({bookmark})
      //         setBookData(bookmark)
      //         setLoading(false);      
      //       }
          
      // },[post]);

      useEffect(() => {
        setLoading(true);
      
        if (post.length > 0) {
          // Filter posts that have been bookmarked by the current user
          const bookmarkedPosts = post.filter((singlePost: any) =>
            singlePost.bookmarks.some((_book: any) => _book.userRef === userRef)
          );
      
          // Sort bookmarkedPosts based on current_time in bookmarks array
          const sortedBookmarkedPosts = bookmarkedPosts.sort((a: any, b: any) => {
            const timeA = a.bookmarks.find((_book: any) => _book.userRef === userRef)?.current_time || 0;
            const timeB = b.bookmarks.find((_book: any) => _book.userRef === userRef)?.current_time || 0;
      
            // Sorting in descending order; adjust as needed
            return timeB - timeA;
          });
      
          // console.log({ sortedBookmarkedPosts });
      
          // Update state with sorted and filtered posts
          setBookData(sortedBookmarkedPosts);
          setLoading(false);
        }
      }, [post, userRef]);

      // const deleteAllBookmark = async () => {
      //   const getPost = collection(db, "posts");
      //   const unSubscribe = onSnapshot(getPost, (querySnapShot) => {
      //     querySnapShot.forEach(async (doc) => {
      //       const postData = doc.data();
      //       const bookmark_to_delete = postData.bookmarks.find(_book => _book.userRef === userRef);
      //    if(bookmark_to_delete){
      //     const {postDoc, postRef} = await getDocument(postData.id)  
      //     await updateDoc(postRef, {
      //       bookmarks: arrayRemove(bookmark_to_delete),
      //     });
      //    }    
      //       console.log({bookmark_to_delete})
      //     });
      //   });
      // }

      const deleteAllBookmarks = async () => {
        try {
          const postCollection = collection(db, "posts");
          const querySnapshot = await getDocs(postCollection);
      
          const deletePromises = querySnapshot.docs.map(async (doc) => {
            const postData: any = doc.data();
            const bookmarkToDelete = postData.bookmarks.find((_book: any )=> _book.userRef === userRef);
      
            if (bookmarkToDelete) {
              const { postRef }: any = await getDocument(postData.id);
              await updateDoc(postRef, {
                bookmarks: arrayRemove(bookmarkToDelete),
              });
            }
      
            return bookmarkToDelete;
          });
      
          const deletedBookmarks = await Promise.all(deletePromises);
          console.log({ deletedBookmarks });
        } catch (error) {
          console.error("Error deleting bookmarks:", error);
        }
      };

      const showPromiseConfirm = () => {
        confirm({
          title: 'Delete Bookmarks',
          icon: <ExclamationCircleFilled />,
          content: `Are you sure you want to delete ${bookData.length} bookmarks?`,
           onOk() {
            return deleteAllBookmarks()
              .then(() => {
                console.log('Bookmarks deleted successfully!');
              })
              .catch((error) => {
                console.error('Oops errors!', error);
              });
          },
          onCancel() {},
        });
      };
      

      // useEffect(() => {
      //   console.log({post})
      //   console.log({bookData})
      // },[post, bookData]);

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
              // setLiked(false);
              await updateDoc(postRef, {
                likedBy: arrayRemove(userRef),
                likes: increment(-1),
              });
            } else {
              await updateDoc(postRef, {
                likedBy: arrayUnion(userRef),
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

  return (
    <main className="bookmark_body">
        <section className="bookmark_top">
            <div className="return" onClick={()=> navigate(-1)}>
            <IoReturnDownBack size={18} color='#543EE0'/>
            </div>
            <div className="title">
            <p className="bookmark_title">Bookmarks</p>
            </div>
            <div className="clear">
                <button className="clear_all" onClick={showPromiseConfirm}>
                    Clear All Bookmarks
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
              <EachPostOthers
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

