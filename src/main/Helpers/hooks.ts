import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { ref, uploadString, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";
import { useEffect, useState } from "react";


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

export function uploadProfileMedia(type: string,){
  let uploadProfileImage: (params: { image: string; userRef: string }) => Promise<void>;

  if (type === 'profile_image') {
    uploadProfileImage = async ({ image, userRef }) => {
      if (image === '') return;
      const profileImage = ref(storage, `profileImage/${userRef}-${type}`);
      await uploadString(profileImage, image, 'data_url');
    };
  } else if (type === 'header') {
    uploadProfileImage = async ({ image, userRef }) => {
      if (image === '') return;
      const profileImage = ref(storage, `profileheader/${userRef}-${type}`);
      await uploadString(profileImage, image, 'data_url');
    };
  }

  return { uploadProfileImage };
}

export const uploadHeader = async (file, userRef : string, header_set: any)=>{
  try{
    const headerRef = ref(storage, `profileheader/${userRef}-header`);
    await uploadBytes(headerRef, file).then((response)=> header_set(true))
  }catch{
    console.log('upload error')
  }
}

export function useDownloadimage(){
  const downloadImage = async (item : string) => {
    const imageRef = ref(storage, `postImage/${item}`);
    const downloadUrl = await getDownloadURL(imageRef)
      return downloadUrl;
  }
  return {downloadImage}
}

export function useDownloadProfileImage(){
  const downloadProfileImage = async (item: string)=>{
    const imageRef = ref(storage, `profileImage/${item}-profile_image`);
    const downloadUrl = await getDownloadURL(imageRef)
    return downloadUrl;
  }
  return {downloadProfileImage}
}

export function useDownloadHeaderImage(){
  const downloadHeaderImage = async (item: string)=>{
    const imageRef = ref(storage, `profileheader/${item}-header`);
    const downloadUrl = await getDownloadURL(imageRef)
    return downloadUrl;
  }
  return {downloadHeaderImage}
}


export const useMediaHandler = () => {
  const [error, setError] = useState('');
  const [image, setImage] = useState('');
  const [caption, setCaption] = useState('');

  const handleMedia = (file) => {
    console.log({file})
    let files = file;
    let fileType = files.type;
    let filename = files.name;
    let validExtension = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
  
    if (validExtension.includes(fileType)) {
      let fileReader = new FileReader();
      fileReader.readAsDataURL(files);
      fileReader.onload = () => {
        setImage(fileReader.result);
        setCaption(filename);
      };
    } else {
      setError('Please upload either a JPEG or PNG format file');
      return false;
    }
  };

  const removeMedia = () => {
    setImage('');
  };
  return { image, caption, error, handleMedia, removeMedia , setImage};
};




