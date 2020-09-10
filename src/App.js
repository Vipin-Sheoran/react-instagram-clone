import React,{useState,useEffect} from 'react';
import'./App.css';
import Post from './Posts'
import {db,auth} from './firebase'
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {Button,Input} from '@material-ui/core'
import ImageUpload from './ImageUpload'
import InstagramEmbed from 'react-instagram-embed'

//useEffect runs a specific code based on a specific condition
//ex:run a code when a page refreshes


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);

function App() {
  const[posts,setPosts]=useState([])
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [username,setUsername]=useState('')           
  const [password,setPassword]=useState('')
  const [email,setEmail]=useState('')
  const [user,setUser]=useState(null)
  const [openSignIn,setopenSignIn]=useState(false)

 useEffect(()=>{
 auth.onAuthStateChanged((authUser)=>{
   if(authUser){
        //...a user has logged in 
        //  console.log(authUser)
         setUser(authUser)
            if(authUser.displayName){
             //dont update username
           }else{
             //if we just created someone
             return authUser.updateProfile({
               displayName:username
             })
          }
          }else{
            setUser(null)
         //user has logged out
            }
           })
   },[user,username])

useEffect(()=>{
  //runs everytime when the variable post changes
  db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=>{
    setPosts(snapshot.docs.map(doc=>({
      post:doc.data(),
      id:doc.id})))
    //every time a new post is added or any kind of takes place snapshot willl fires and refreshes
  })
},[])//[] this will just refreshes the every time a new post is added nothing else


const handleClose = () => {
  setOpen(false);
};
const signUp=(event)=>{
  event.preventDefault()
  auth.createUserWithEmailAndPassword(email,password).then(
    (authUser)=>{
      console.log(authUser.user)
      return authUser.user.updateProfile({
        displayName:username
      })
    }
  )
  .catch((error)=>{             //this is gonna take email and password from state
    alert(error.message)
  })
  setOpen(false)
}
const signIn=(event)=>{
  event.preventDefault()
  auth.signInWithEmailAndPassword(email,password).catch((error)=>{
    alert(error.message)
  })
  setopenSignIn(false)
}
const logOut=(event)=>{
event.preventDefault()
auth.signOut()

}
  return (
    <div className="App">
     
      
      <Modal
        open={open}
        onClose={handleClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signup'>
    <center>
    <img className="appheader__image"
       src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
       alt="">
       </img>
       </center>
       <Input type='text' 
      placeholder='username' 
      value={username} 
      onChange={(e)=>{setUsername(e.target.value)}}
      />
      <Input type='text' 
      placeholder='email' 
      value={email} 
      onChange={(e)=>{setEmail(e.target.value)}}
      />
      <Input type='password' 
      placeholder='password' 
      value={password} 
      onChange={(e)=>{setPassword(e.target.value)}}
      />
      <Button type='submit' onClick={signUp}>sign up</Button>
      </form>
  </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={()=>{setopenSignIn(false)}}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signup'>
    <center>
    <img className="appheader__image"
       src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
       alt="">
       </img>
       </center>
      <Input type='text' 
      placeholder='email' 
      value={email} 
      onChange={(e)=>{setEmail(e.target.value)}}
      />
      <Input type='password' 
      placeholder='password' 
      value={password} 
      onChange={(e)=>{setPassword(e.target.value)}}
      />
      <Button type='submit' onClick={signIn}>sign in</Button>
      </form>
  </div>
      </Modal>
      
      <div className='app__header'>
       <img className="appheader__image"
       src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
       alt="">
       </img>
       {
        !user ? (<div>
        <Button onClick={()=>{setOpen(true)}}>Sign up</Button>
        <Button onClick={()=>{setopenSignIn(true)}}>Sign in</Button> 
        </div>
        )
         :(<Button onClick={logOut}>Logout</Button>)
       }
      </div>
       
      <h1>lets build instagram clone together</h1>
      <div className='app_posts'>
      <div className="apppost_left">
{
  posts.map(({post,id})=>(
    <Post key={id} postId={id} username={post.username} user={user} imageURL={post.imageURL} caption={post.caption}/>
  ))
}
</div>
<div className="apppost_right">
<InstagramEmbed
  url='https://www.instagram.com/sheoranvipin2910/'
  maxWidth={320}
  hideCaption={false}
  containerTagName='div'
  protocol=''
  injectScript
  onLoading={() => {}}
  onSuccess={() => {}}
  onAfterRender={() => {}}
  onFailure={() => {}}
 />
</div>

</div>

      {
        user?.displayName?(<ImageUpload username={user.displayName}/>):
        <h3>Please login to Upload</h3>
      }
    </div>
  );
}

export default App;
