import React,{useState} from 'react'
import {Button,Input} from '@material-ui/core'
import {storage,db} from './firebase'
import firebase from 'firebase'
import './ImageUpload.css'

function ImageUpload({username}){
 const [image,setImage]=useState(null)
//  const [url,setUrl]=useState('')
 const [caption,setCaption]=useState('')
 const [progress,setProgress]=useState(0)

 const handleChange=(e)=>{
if(e.target.files[0]){
    setImage(e.target.files[0])
}
 }
 const handleUpload=()=>{
  const uploadTask=storage.ref(`images/${image.name}`).put(image)

  uploadTask.on(
      "state_changed",
      (snapshot)=>{
          //progress function...
          const progress=Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes)*100
          )
          setProgress(progress)
      },
      (error)=>{
          console.log(error.message)
          alert(error.message)
      },
      ()=>{
          //complete function
          storage.ref("images")
          .child(image.name)
          .getDownloadURL()
          .then(
              url=>{
                  //post image inside db
                  db.collection('posts').add({
                      timestamp:firebase.firestore.FieldValue.serverTimestamp(),    //file uploaded late will appear on the top
                      username:username,
                      imageURL:url,
                      caption:caption
                  })
                  setProgress(0)
                  setCaption('')
                  setImage(null)

              }
          )
      }
  )
 }
    return(
        <div className='imageupload'>
            <progress className='imageupload_progress' value={progress} max="100"></progress>
            <Input type='text' placeholder='Enter a caption' onChange={(event)=>setCaption(event.target.value)}/>
            <Input type="file" onChange={handleChange}/>
            <Button onClick={handleUpload}
            >Upload</Button>
        </div>
    )
}

export default ImageUpload