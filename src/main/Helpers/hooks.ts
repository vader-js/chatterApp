import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { ref, uploadString, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";


export function useGetDoc(){
    const getDocument = async (post) => {
        try {
          if (!post) {
            return { postDoc: null, postRef: null };
          }
    
          const postCollectionRef = collection(db, 'posts');
          const q = query(postCollectionRef, where('id', '==', post));
          const querySnapShot = await getDocs(q);
    
          let documentId = '';
          if (!querySnapShot.empty) {
            querySnapShot.forEach((docs) => {
              documentId = docs.id;
            });
          }
    
          const postRef = doc(db, 'posts', documentId);
          const postDoc = await getDoc(postRef);
    
          return { postDoc, postRef };
        } catch (error) {
          console.error('Error fetching document:', error);
          throw error;
        }
      };
    
      return { getDocument };
    }

export function useGetUserDoc(){
    const getUserDoc = async (userId)=>{
        try{
            const userCollectionRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userCollectionRef);
            // const querySnapShot = await getSnapShot(userCollectionRef
            return {userCollectionRef, userDoc}
        }catch (error) {
            console.log('user doc update failed', error)
        }
       
    }
   return {getUserDoc}
}

// Upload a single image to Firebase Storage and return its URL
export function useUploadImage() {
  const uploadImageToStorage = async ({image, UniqueId})=>{
    if (image === '') return;
    const imageRef = ref(storage , `postImage/${UniqueId}`)
    const upload = await uploadBytes(imageRef, image)
    return {upload}
  }

  return { uploadImageToStorage };
}

export function useDownloadimage(){
  const downloadImage = async (item) => {
    const imageRef = ref(storage, `postImage/${item}`);
    const downloadUrl = await getDownloadURL(imageRef)
      return downloadUrl;
  }
  return {downloadImage}
}







