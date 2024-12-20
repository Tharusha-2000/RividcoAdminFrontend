// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7y3Mhn3LwhH5FKfeqdElEU3fHSLxhdk4",
  authDomain: "zionlogy-4b6e6.firebaseapp.com",
  projectId: "zionlogy-4b6e6",
  storageBucket: "zionlogy-4b6e6.appspot.com",
  messagingSenderId: "620982867848",
  appId: "1:620982867848:web:50fd0bf64116facbdf0c3d",
  measurementId: "G-SYTBRFFJM7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);





// import React, { useState } from 'react';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { v4 as uuidv4 } from 'uuid';
// import { storage } from '../config/firebase';


// export default function  Test ()  {
//     const [image, setImage] = useState(null);
//     const [progress, setProgress] = useState(0);
//     const [imageUrls, setImageUrls] = useState([]);
  
//     const uploadFile = () => {
//       if (image == null) return;
  
//       const imagePath = `img/${image.name + uuidv4()}`;
//       console.log('imagePath', imagePath);
//       const imageRef = ref(storage, imagePath);
//       const uploadTask = uploadBytesResumable(imageRef, image);
  
//       uploadTask.on(
//         'state_changed',
//         (snapshot) => {
//           const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
//           setProgress(progress);
//         },
//         (err) => {
//           console.log('hi');
//           console.log('Error while uploading file', err);
//         },
//         () => {
//           setProgress(0);
//           getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//             console.log('File available at', downloadURL);
//             setImageUrls((prev) => [...prev, downloadURL]);
//           });
//         }
//       );
//     };
  
//        // Upload file
//        const upload =() => {
  
//           if (image === null) {
//              return;
//              console.log("no image selected");
//           }
//           console.log(">>>");
//           const imagePath = `product/${image.name + uuidv4()}`;
//           const imageRef = ref(storage,imagePath);
//           const uploadFile = uploadBytesResumable(imageRef, image);
      
//           uploadFile.on('state_changed', (snapshot) => {
//             const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100);
//             setProgress(progress)
//           }, (err) => {
//             console.log("error while uploading file", err);
//           }, () => {
//             setProgress(0);
//             getDownloadURL(uploadFile.snapshot.ref).then((downloadURL) => {
//               console.log('File available at', downloadURL);
            
          
//             console.log(imagePath);
//             // Save the path of the uploaded image
         
      
//               setImageUrl(downloadURL)
//              console.log(downloadURL);
//               console.log(imageUrl);
                  
      
//             });
//             setImage(null);
//           });
         
//         }
  
//     return (
//       <div>
//         <input
//           type="file"
//           onChange={(event) => {
//             setImage(event.target.files[0]);
//           }}
//         />
//         <button onClick={upload}>Upload Image</button>
//         <div>Progress: {progress}%</div>
//         <div>
     
//         </div>
//       </div>
//     );

//   };