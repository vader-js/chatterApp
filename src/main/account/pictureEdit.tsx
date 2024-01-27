import { ProfileCircle } from 'iconsax-react';
import React, { useEffect, useRef } from 'react'
import { uploadProfileMedia, useMediaHandler } from '../Helpers/hooks';
import './edit.css'

export default function PictureEdit({image, handleMedia}: any) {
    const choose_ref = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);



  // style format for drag and drop
  const handleStyleEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropRef.current) {
      dropRef.current.style.border = '2px dashed #543EE0';
    }
  };

  const handleStyleLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropRef.current) {
      dropRef.current.style.border = '1px solid #543EE0';
    }
  };

  const handleStyleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropRef.current) {
      dropRef.current.style.border = '1px solid #543EE0';
    }
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleMedia(files[0]);
    }
  };

  const handlefileSelect = (e: React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
    e.preventDefault();
    if (choose_ref.current) {
        choose_ref.current.click();
    }
  }
  const handleMediaChange = (e: any)=>{
    console.log({e})
    handleMedia(e)
  }

useEffect(()=>{
  console.log({image})
},[image]);

  return (
    <main className='pictureEdit_main'>
      <div className="body">
        <section
          className="body_upload"
          ref={dropRef}
          onDragEnter={handleStyleEnter}
          onDragLeave={handleStyleLeave}
          onDragOver={handleStyleEnter}
          onDrop={handleStyleDrop}
        >
          <aside className="profile">
            {!image ? (
              <ProfileCircle size="100" color="#555555" />
            ) : (
              <img src={image} alt="profile" />
            )}
          </aside>
          <p className="group_desc">Drag and drop Picture</p>
          <p className="group_desc2">OR</p>
          <form action="">
            <label htmlFor="projectImage" onClick={()=> handlefileSelect}>
              Select from device
            </label>
            {!image && <p className="my-5 text-sm">MAXIMUM SIZE: 500Kb</p>}

            <input
              type="file"
              name="projectImage"
              id="projectImage"
              accept="image/jpeg, image/png"
              ref={choose_ref}
              onChange={(e) => handleMediaChange(e.target.files?.[0])}
            />
          </form>
        </section>
        
       
      </div>
    </main>
  )
}

{/* <section className="upload_button">
<button
  disabled={!image}
  style={{
    cursor: !image ? 'not-allowed' : 'pointer',
    opacity: !image ? '0.7' : '1',
  }}
  aria-label="Upload Photo"
>
  upload
</button>
</section> */}