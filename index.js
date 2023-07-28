

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase,set, ref, push, onValue, remove,update,get,limitToLast   } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getStorage, ref as sRef,uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";

import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,onAuthStateChanged, fetchSignInMethodsForEmail, signOut    } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC4nZt7BlnLm7A5Q_MMZZW1Y_xuTPbVYFg",
  authDomain: "loginapp-f9b72.firebaseapp.com",
  databaseURL: "https://loginapp-f9b72-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "loginapp-f9b72",
  storageBucket: "loginapp-f9b72.appspot.com",
  messagingSenderId: "130391795923",
  appId: "1:130391795923:web:c751451d5c71bf8fad8c26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const auth = getAuth(app);
   const user = auth.currentUser;

let items = []
   let  inputEl =document.getElementById("input-el");

const saveBtn = document.getElementById("save-btn")
saveBtn.addEventListener("click", function(){
  // const user = auth.currentUser
  // if(!user){
  //   return;

  // }
   const user = auth.currentUser;
  if (!user) {
    // User is not signed in
    return;
  }
  const savedEntry = inputEl.value

  const entrySavedInDB = ref(database, `userEntrySaved/${user.uid}`)
  push(entrySavedInDB, savedEntry)
  clearInputField ()
  // location.reload();
  
})

function clearInputField (){
  let  inputEl =document.getElementById("input-el");
inputEl.value=""
}




const noEntry = document.getElementById("noEntry")
let currentDataEntry = []
  auth.onAuthStateChanged(function(user) {
      
  if (user) {
         const entrySavedInDB = ref(database, `userEntrySaved/${user.uid}`)

    onValue(entrySavedInDB, function (snapshot){
      if (snapshot.exists()){
        let dataEntry = Object.entries(snapshot.val())
    
        for (let i = 0; i< dataEntry.length; i++){
          currentDataEntry = dataEntry[i]
          displaySavedEntryInDB (currentDataEntry)
        }

      } 
      else{
        noEntry.textContent= "There are no saved entries "
      }
    })
    document.getElementById("signup-container").style.display = "none";
    document.getElementById("signup-page").style.display = "none";

    document.getElementById("logoutBtn").style.display = "block";
  }else{
    document.getElementById("signup-container").style.display = "block";


  }
  });
 
    // const uid = user.uid;
    // ...
function displaySavedEntryInDB(item) {
  let newEntry = document.createElement("div");
  let smallerNewEntryDiv = document.createElement("div");
  
  newEntry.id = "newEntry";
  smallerNewEntryDiv.id = "smallerNewEntryDiv";
  
  newEntry.append(smallerNewEntryDiv);

  const noEntry = document.getElementById("noEntry");
  smallerNewEntryDiv.innerHTML = ` <div id="ItemDiv"> 
  <p id="itemP">${item[1]} 
  </p> <br>
  <p>Click to Show login button </p>
  </div>
  
  `;
  let vocabID = item[0];

  let btnConfirm = document.createElement("button");
  smallerNewEntryDiv.append(btnConfirm);

  let icon = document.createElement("i");
  icon.classList = "fa fa-trash";
  btnConfirm.append(icon);
  btnConfirm.id = "btnConfirm";
  let removeFromDB 

const user = auth.currentUser;
        if (user) {
  btnConfirm.addEventListener("click", function () {
    // const user = auth.currentUser;
    document.getElementById('id01').style.display='block'

    document.getElementById("span").textContent=item[1];
 removeFromDB = {
   vocabIDInDB : ref(database, `userEntrySaved/${user.uid}/${vocabID}`),
   userEntryInDB : ref(database, `userEntry/${user.uid}/${vocabID}`),
  userLogOutButtonClickedInDB : ref(database, `userLogOutButtonClicked/${user.uid}/${vocabID}`),
  userLogOutEntryInDB: ref(database, `userLogOutEntry/${user.uid}/${vocabID}`)
}

   

  });
  let btnRemove = document.getElementById("btnRemove")
   btnRemove.addEventListener("click", function(){
    remove(removeFromDB.vocabIDInDB );
    remove(removeFromDB.userEntryInDB );
    remove(removeFromDB.userLogOutButtonClickedInDB );
    remove( removeFromDB.userLogOutEntryInDB );

    // location.reload();
    document.getElementById('id01').style.display='none'

})
        }
 
    let quit = false;

  // Add a click event listener to each entry to create a new div
  newEntry.addEventListener("click", function () {
    if(quit) {
        
      return;
   } 
   quit = true;
    document.getElementById('loginModal').style.display='block'

    // Create a new div to display the details of the clicked entry
    let newlyDiv = document.createElement("div");
  newlyDiv.id = "newlyDiv";
    
    newlyDiv.textContent = ` ${item[1]}`;
    // Add this new div to the DOM
      
    document.getElementById("loginModal").appendChild(newlyDiv);
    
   
   let logInBtn = document.createElement("button")
          logInBtn.id="logInBtn"
          logInBtn.innerHTML="Login"
          newlyDiv.append(logInBtn)
   
          
  logInBtn.addEventListener("click", function () {
      const user = auth.currentUser;
        if (user) {
          // Rest of your login button logic here...
             const loginTimestamp = Date.now();
 let  LoginDateMessage = ` Login Date: ${new Date(loginTimestamp).toLocaleTimeString('en-GB',{weekday: 'long', hour12: true, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit'})}`;


      const LoginDateSavedInDB = ref(database, `userEntry/${user.uid}/${vocabID}`)
  push(LoginDateSavedInDB, LoginDateMessage)
      console.log(item[1])
      console.log(LoginDateMessage)

    // location.reload();
  smallerNewEntryDiv.innerHTML = "";
  newlyDiv.textContent= "";

        } 
     
    document.getElementById('loginModal').style.display='none'
      
  })
          
  });
  //  Create a new div to display the login dates
   let logInandLogOutDiv = document.createElement("div");
    logInandLogOutDiv.id="logInandLogOutDiv"
  newEntry.appendChild(logInandLogOutDiv);
  let loginDatesDiv = document.createElement("div");
  loginDatesDiv.id = "loginDatesDiv";
  logInandLogOutDiv.appendChild(loginDatesDiv);
let loginMessageDiv = document.createElement("div")
loginMessageDiv.id="loginMessageDiv";



  // Fetch and display the login dates for the clicked entry
  auth.onAuthStateChanged(function(user) {
  if (user) {
    
    // User is signed in
    const loginDatesRef = ref(database, `userEntry/${user.uid}/${vocabID}`);
  onValue(loginDatesRef, (snapshot) => {
    loginDatesDiv.innerHTML = ""; // Clear the div before adding new login dates
    if (snapshot.exists()) {
      let dataEntry = Object.values(snapshot.val())
     let loginDateIDs = Object.keys(snapshot.val()); // Get the login date IDs

        for (let i = 0; i< dataEntry.length; i++){
            // let loginTimeDiffernce = 

        //   displaySavedEntryInDB (currentDataEntry)
             let loginDateElement = document.createElement("p");
             loginDateElement.id="loginDateElement"
        loginDateElement.textContent = dataEntry[i];
    loginDatesDiv.appendChild(loginDateElement);
   
                  const logOutButton = document.createElement("button")
                  logOutButton.id="logOutButton";
                  logOutButton.onclick
    logOutButton.textContent= "Log Out"
    const buttonID = loginDateIDs[i];
        const buttonClickedRef = ref(database, `userLogOutButtonClicked/${user.uid}/${vocabID}/${buttonID}`);
        get(buttonClickedRef).then((snapshot) => {
          if (snapshot.exists() && snapshot.val() === true) {
            logOutButton.disabled = true;

          } else {
            logOutButton.disabled = false; // Ensure the button is enabled initially
            logOutButton.style.background="linear-gradient(90deg, #FFFFFF 0%, #FDA43C 100%)"
            logOutButton.style.border="none";
            logOutButton.style.marginLeft="10px"
            logOutButton.style.padding="10px"
            logOutButton.style.borderRadius="10px"





            
           let warningSign= document.getElementById("warningSign")
           let warningSignDiv= document.createElement("div")
           warningSignDiv.id="warningSignDiv"
           let gify = document.createElement("img")
           gify.src="giphy.gif"
           gify.id="gify"

           
            let loginMessageBtn = document.createElement("button")
            loginMessageBtn.id="loginMessageBtn"
            warningSignDiv.textContent = `You just logged in `
            warningSignDiv.append(loginMessageBtn);

            loginMessageBtn.id ="loginMessageBtn"
            loginMessageBtn.textContent ="Log out from your last login"


            warningSign.append(gify);
            warningSign.append(warningSignDiv);
        

            loginMessageBtn.addEventListener('click', logOutHandle);


          }
        });
   logOutButton.disabled = false; // Ensure the button is enabled initially
   logOutButton.addEventListener('click', logOutHandle);
   async function logOutHandle () {
  const buttonID = loginDateIDs[i];
  const buttonClickedRef = ref(database, `userLogOutButtonClicked/${user.uid}/${vocabID}/${buttonID}`);

  // Disable the button before starting the Firebase operation
  logOutButton.disabled = true;

  try {
    // Set the buttonClickedRef to true in the database
    await set(buttonClickedRef, true);

    // Perform the logout date calculation and saving to the database
    // ... (your existing code for logout date calculation)
    let timeDifferenceLogin = dataEntry[i]
    const loginTimestamp = Date.now();
     const loginDateStr = timeDifferenceLogin.replace("Login Date: ", "");
     const [weekday, dateStr, timeStr] = loginDateStr.split(", ");
     const [day, month, year] = dateStr.split("/");
     const [time, period] = timeStr.split(" ");
   
     // Extract hours and minutes from the time string
     let [hours, minutes] = time.split(":");
     hours = parseInt(hours);
     if (period.toLowerCase() === "pm" && hours !== 12) {
       hours += 12;
     } else if (period.toLowerCase() === "am" && hours === 12) {
       hours = 0;
     }
   
     // Create a new Date object for the login date and time
     const loginDate = new Date(year, month - 1, day, hours, minutes);
   
     // Calculate the time difference
     const timeDifference = loginTimestamp - loginDate.getTime();
   
     // Convert time difference to human-readable format (e.g., hours and minutes)
     const hoursDiff = Math.floor(timeDifference / 3600000); // 1 hour = 3600000 milliseconds
     const minutesDiff = Math.floor((timeDifference % 3600000) / 60000); // 1 minute = 60000 milliseconds
   
     console.log(`Time Difference: ${hoursDiff} hours and ${minutesDiff} minutes`);
   
     let LogOutDateMessage = ` Logout Date: ${new Date(loginTimestamp).toLocaleTimeString('en-GB', { weekday: 'long', hour12: true, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      Total time: ${hoursDiff} hours and ${minutesDiff} minutes `;
     console.log(LogOutDateMessage);
   
     const LogOutDateSavedInDB = ref(database, `userLogOutEntry/${user.uid}/${vocabID}`);
     push(LogOutDateSavedInDB, LogOutDateMessage);
     location.reload();
    
    // After the Firebase operation is completed, enable the button again
    logOutButton.disabled = false;
  } catch (error) {
    // If an error occurs, log it or handle it appropriately
    console.error("Error occurred:", error);
    // Re-enable the button to allow the user to try again
    logOutButton.disabled = false;
  }
  



};
loginDateElement.append(logOutButton);
       
        }
    }
  
  });
  }
  });
  
 
  // Create a new div to display the out dates

  let logOutDatesDiv = document.createElement("div");
  loginDatesDiv.id = "loginDatesDiv";
  logInandLogOutDiv.append(logOutDatesDiv);
   
    // Fetch and display the login dates for the clicked entry
      auth.onAuthStateChanged(function(user) {
  if (user) {
    document.getElementById("logoutBtn").style.display = "block";
    
    // User is signed in
    const logOutDatesRef = ref(database, `userLogOutEntry/${user.uid}/${vocabID}`);
    onValue(logOutDatesRef, (snapshot) => {
      logOutDatesDiv.innerHTML = ""; // Clear the div before adding new login dates
      if (snapshot.exists()) {
        let LogOutDataEntry = Object.values(snapshot.val())
      
          for (let i = 0; i< LogOutDataEntry.length; i++){
          //   displaySavedEntryInDB (currentDataEntry)
               let logOutDateElement = document.createElement("p");
               logOutDateElement.id="logOutDateElement"
               logOutDateElement.textContent = LogOutDataEntry[i];
               logOutDatesDiv.appendChild(logOutDateElement);
        //   document.getElementById("logOutButton").disabled= true;
//                const logOutButtons = document.querySelectorAll("[id='logOutButton']");

// // Disable all logOutButtons
// logOutButtons.forEach(button => {
//   button.disabled = true;
// });
               

     
          }
      }
    
    });
  }else{
    document.getElementById("logoutBtn").style.display = "none";
    


  }
  });
    

  noEntry.append(newEntry);
}





const signUp = document.getElementById("signUp")
signUp.addEventListener("click", (e) => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value;

    const check = document.querySelector('#agreement:checked') !== null

    e.preventDefault();
   
    

    let messageWarning 
    if (!check){
      messageWarning = document.getElementById("notCheckedWarning").style.display = "block";
return false
// check =check.requred
    }else{
      messageWarning = document.getElementById("notCheckedWarning").style.display = "none";

    }
 


  createUserWithEmailAndPassword(auth, email, password, check)
      .then((userCredential) => {
      // Signed in 
      document.getElementById("signup-page").style.display = "none";

    

      const user = userCredential.user;
      set(ref(database, "users/" + user.uid),{
          username: username,
          email: email,
          check : check,
          
      })

      // ...
      document.getElementById("signup-evalidation").style.display = "none";
     
     
      


    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
      document.getElementById("signup-evalidation").style.display = "flex";

      
    });
})




const signin = document.getElementById("signin")

signin.addEventListener("click", () => {
  const email = document.getElementById("signin-email").value;
  const password = document.getElementById("signin-password").value;

  signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          const dt = new Date();
          update(ref(database, "users/" + user.uid), {
              last_login: dt,
          })
          
      document.getElementById("signin-evalidation").style.display = "none";
      window.location.reload()  //   to refresh the page so that  the current user's data that is retrieved in "My List" can be displayed wihtout having to refresh the page 

        
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
      
      document.getElementById("signin-evalidation").style.display = "flex";

        });

})
let logoutBtn = document.getElementById("logoutBtn")
logoutBtn.addEventListener("click", (e) => {
e.preventDefault();
auth.signOut();

window.location.reload()  //   to refresh the page so that  the current user's data that is retrieved in "My List" can be displayed wihtout having to refresh the page 

})
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
// // import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
// import { getDatabase,set, ref, push, onValue, remove,update,get,limitToLast   } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
// import { getStorage, ref as sRef,uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";

// import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,onAuthStateChanged, fetchSignInMethodsForEmail, signOut    } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

// const firebaseConfig = {
//   apiKey: "AIzaSyC4nZt7BlnLm7A5Q_MMZZW1Y_xuTPbVYFg",
//   authDomain: "loginapp-f9b72.firebaseapp.com",
//   databaseURL: "https://loginapp-f9b72-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "loginapp-f9b72",
//   storageBucket: "loginapp-f9b72.appspot.com",
//   messagingSenderId: "130391795923",
//   appId: "1:130391795923:web:c751451d5c71bf8fad8c26"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// const auth = getAuth(app);
// let items = []
//    let  inputEl =document.getElementById("input-el");

// const saveBtn = document.getElementById("save-btn")
// saveBtn.addEventListener("click", function(){
//   // const user = auth.currentUser
//   // if(!user){
//   //   return;

//   // }
//   const savedEntry = inputEl.value

//   const entrySavedInDB = ref(database, `userEntrySaved`)
//   push(entrySavedInDB, savedEntry)
//   clearInputField ()
//   location.reload();
  
// })

// function clearInputField (){
//   let  inputEl =document.getElementById("input-el");
// inputEl.value=""
// }




// const noEntry = document.getElementById("noEntry")
// let currentDataEntry = []

//     const entrySavedInDB = ref(database, `userEntrySaved`)

//     onValue(entrySavedInDB, function (snapshot){
//       if (snapshot.exists()){
//         let dataEntry = Object.entries(snapshot.val())
    
//         for (let i = 0; i< dataEntry.length; i++){
//           currentDataEntry = dataEntry[i]
//           displaySavedEntryInDB (currentDataEntry)
//         }

//       } 
//       else{
//         noEntry.textContent= "There are no saved entries "
//       }
//     })
//     // const uid = user.uid;
//     // ...
// function displaySavedEntryInDB(item) {
//   let newEntry = document.createElement("div");
//   let smallerNewEntryDiv = document.createElement("div");
  
//   newEntry.id = "newEntry";
//   smallerNewEntryDiv.id = "smallerNewEntryDiv";
  
//   newEntry.append(smallerNewEntryDiv);

//   const noEntry = document.getElementById("noEntry");
//   smallerNewEntryDiv.innerHTML = ` <p id="itemP">${item[1]} </p>`;
//   let vocabID = item[0];

//   let btnConfirm = document.createElement("button");
//   smallerNewEntryDiv.append(btnConfirm);

//   let icon = document.createElement("i");
//   icon.classList = "fa fa-trash";
//   btnConfirm.append(icon);
//   btnConfirm.id = "btnConfirm";

//   btnConfirm.addEventListener("click", function () {
//     const user = auth.currentUser;
//     const exactLocationOfItemInDB = ref(database, `userEntrySaved/${vocabID}`);
//     remove(exactLocationOfItemInDB);
//     location.reload();
//   });

//   // Add a click event listener to each entry to create a new div
//   newEntry.addEventListener("click", function () {
  
//     // Create a new div to display the details of the clicked entry
//     let newlyDiv = document.createElement("div");
//   newlyDiv.id = "newlyDiv";
    
//     newlyDiv.textContent = ` ${item[1]}`;
//     // Add this new div to the DOM
      
//     document.getElementById("clickedEntryDetails").appendChild(newlyDiv);
    
   
//    let logInBtn = document.createElement("button")
//           logInBtn.id="logInBtn"
//           logInBtn.innerHTML="Login"
//           newlyDiv.append(logInBtn)
//   logInBtn.addEventListener("click", function () {
//         const loginTimestamp = Date.now();
//           let options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
// let loginDate = new Date(loginTimestamp).toLocaleString('en-GB', options);
// let LoginDateMessage = `Login Date: ${loginDate}`;


//       const LoginDateSavedInDB = ref(database, `userEntry/${vocabID}`)
//   push(LoginDateSavedInDB, LoginDateMessage)
//       console.log(item[1])
//       console.log(LoginDateMessage)
//     location.reload();
      
//   })
          
//   });
//    // Create a new div to display the login dates
//    let logInandLogOutDiv = document.createElement("div");
//     logInandLogOutDiv.id="logInandLogOutDiv"
//   newEntry.appendChild(logInandLogOutDiv);
//   let loginDatesDiv = document.createElement("div");
//   loginDatesDiv.id = "loginDatesDiv";
//   logInandLogOutDiv.appendChild(loginDatesDiv);

//   // Fetch and display the login dates for the clicked entry
//   const loginDatesRef = ref(database, `userEntry/${vocabID}`);
//   onValue(loginDatesRef, (snapshot) => {
//     loginDatesDiv.innerHTML = ""; // Clear the div before adding new login dates
//     if (snapshot.exists()) {
//       let dataEntry = Object.values(snapshot.val())
    
//         for (let i = 0; i< dataEntry.length; i++){
//         //   displaySavedEntryInDB (currentDataEntry)
//              let loginDateElement = document.createElement("p");
//              loginDateElement.id="loginDateElement"
//         loginDateElement.textContent = dataEntry[i];
//     loginDatesDiv.appendChild(loginDateElement);

//     loginDateElement.addEventListener("click", function () {
//       let LogOutBtn = document.createElement("button");
//       LogOutBtn.id = "LogOutBtn";
        
//       LogOutBtn.textContent = ` logOut ${ dataEntry[i]}`;
//       loginDatesDiv.appendChild(LogOutBtn);
//       LogOutBtn.addEventListener("click", function () {
//         const logOutTimestamp = Date.now();
//         const loginTimestamp = dataEntry[i];    
//         let timeDifference = Math.abs( loginTimestamp - logOutTimestamp);
//             //   let hours = Math.floor(timeDifference / 3600000); // 1 hour = 3600000 milliseconds
//             //   let minutes = Math.floor((timeDifference % 3600000) / 60000); // 1 minute = 60000 milliseconds
          
              
//               let  LogOutDateMessage = ` Logout Date: ${new Date(logOutTimestamp).toLocaleTimeString('en-GB',{weekday: 'long', hour12: true, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit'})}`;
// console.log(LogOutDateMessage)
// const LogOutDateSavedInDB = ref(database, `userLogOutEntry/${vocabID}`)
//   push(LogOutDateSavedInDB, LogOutDateMessage)
//     location.reload();
      
//     })
     
//        })
//         }
//     }
  
//   });
 
//   // Create a new div to display the out dates

//   let logOutDatesDiv = document.createElement("div");
//   loginDatesDiv.id = "loginDatesDiv";
//   logInandLogOutDiv.append(logOutDatesDiv);
   
//     // Fetch and display the login dates for the clicked entry
//     const logOutDatesRef = ref(database, `userLogOutEntry/${vocabID}`);
//     onValue(logOutDatesRef, (snapshot) => {
//       logOutDatesDiv.innerHTML = ""; // Clear the div before adding new login dates
//       if (snapshot.exists()) {
//         let dataEntry = Object.values(snapshot.val())
      
//           for (let i = 0; i< dataEntry.length; i++){
//           //   displaySavedEntryInDB (currentDataEntry)
//                let logOutDateElement = document.createElement("p");
//                logOutDateElement.id="logOutDateElement"
//                logOutDateElement.textContent = dataEntry[i];
//                logOutDatesDiv.appendChild(logOutDateElement);
  
//       logOutDateElement.addEventListener("click", function () {
 
       
//          })
//           }
//       }
    
//     });

//   noEntry.append(newEntry);
// }
// function save() {
//    let  inputEl =document.getElementById("input-el");

// if(inputEl.value){
//     let idNo = items.length +1;



//   items.push({
//     inputEl: inputEl.value,
//     id: idNo

//   })
//   inputEl.value = ""

// localStorage.setItem('items', JSON.stringify(items));
// displayImage()
// window.location.reload();

// }

// }





// let btnConfirm = document.createElement("button")
// noEntry.append(btnConfirm)
// let icon = document.createElement("i")
// icon.classList="fa fa-trash"
// btnConfirm.append(icon)
// btnConfirm.id="btnConfirm"

// let exactLocationOfItemInDB
// btnConfirm.addEventListener("click", function(){
//  const user = auth.currentUser;
// //  const currentUsers = user.uid
// //  document.getElementById('id01').style.display='block'
//   exactLocationOfItemInDB = ref(database, `userEntrySaved/${vocabID}`)

// })

// let btnRemove = document.getElementById("btnRemove")
// btnRemove.addEventListener("click", function(){

//  remove(exactLocationOfItemInDB)

// })


















  let DataFromLocalStorage = JSON.parse(localStorage.getItem('items'));
let dataNew = JSON.parse(localStorage.getItem('items'))
  function entry(){
    for(let i =0; i<dataNew.length; i++){
        if(dataNew[i] !==null){
            document.getElementById("noEntry").innerHTML="Saved Entries:"
            // document.getElementById("noEntry").style.display="none"
        } 
        
    }
   
    
}entry()

if (DataFromLocalStorage) {
items = DataFromLocalStorage

}
else {
  console.log("In nodeJS");
}

function displayImage() {
let savedEl = document.getElementById("save-el");

    let liEl= ""
    for (let i = 0; i<items.length; i++){
     
liEl += `



<tr >
<div id="divTr">
<span id="addCount-btn" onclick="createDiv(${i})"> ${items[i].inputEl}</span><span> <button id="delete-btn" onclick="removeItem(${items[i].id})"><i class="fa fa-trash"></i> </button></span>  

</div>
</tr>


`

    }
    savedEl.innerHTML =liEl
    
   }displayImage()

   function removeItem(itemId) {
    // Find the index of the item with the provided itemId
    const index = items.findIndex(item => item.id === itemId);
    
    // If the item exists in the array, remove it
    if (index !== -1) {
      items.splice(index, 1);
      localStorage.setItem('items', JSON.stringify(items));
      const div = document.getElementById("div");
      if (div) {
        div.parentNode.removeChild(div);
        
      }
      displayImage();
      quit = false;

    }
window.location.reload();

  }

  // let quit = false;

 
  function createDiv(index) {
      if(quit) {
        
        return;
     } 
     quit = true;
  let main = document.getElementById("CountDiv")
  
    
        let div = document.createElement("div")
        div.id= "div"
        div.style.padding="10px"
        // countEl.innerHTML="red"
        localStorage.setItem('items', JSON.stringify(items));
        displayImage();
        main.append(div)
        
        let close = document.createElement("button")
        close.id="close"
        close.innerHTML="x"
        div.append(close)
        close.addEventListener("click", hideNewlyCreatedDiv);
  
        function hideNewlyCreatedDiv() {
          
            div.style.display = "none";
        window.location.reload();
  
        
          // return  document.removeEventListener("touchstart", hideNewlyCreatedDiv);
  
        }
       
        let InputElName = document.createElement("h1")
        InputElName.innerHTML = items[index].inputEl
      //   div.textContent=items[index].inputEl
        // if (items[index].hasOwnProperty("inputEl")) {
        //   InputElName.innerHTML = items[index]=.inputEl; // Set the value of InputElName to the name property of the item at the given index
        // }
        InputElName.id= "InputElName"
        div.append(InputElName)
        // let DateN = new Date().toLocaleTimeString();
    
        if(div){
          let logInBtn = document.createElement("button")
          logInBtn.id="logInBtn"
          logInBtn.innerHTML="Login"
          div.append(logInBtn)
          logInBtn.addEventListener("click", loging);
          
           loggingData = {
            loginDate:"",
            logOutDate: ""
          }
  
          // let loginDate
          function loging() {
            loggingData.loginDate = Date.now(); // Store the login date as a timestamp
            let LoginDateMessage = document.createElement("p");
            LoginDateMessage.id = "LoginDateMessage";
            LoginDateMessage.innerHTML = `Login Date: ${new Date(loggingData.loginDate).toLocaleTimeString('en-GB',{weekday: 'long', hour12: true, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit'})}`;
            div.append(LoginDateMessage);
          }
          let LogOutBtn = document.createElement("button");
            LogOutBtn.id = "LogOutBtn";
            LogOutBtn.innerHTML = "Log out";
            div.append(LogOutBtn);
          
            LogOutBtn.addEventListener("click", logOutFunction);
          
            function logOutFunction() {
              loggingData.logOutDate = Date.now(); // Get the current timestamp as the logout date
              let timeDifference = Math.abs(loggingData.logOutDate - loggingData.loginDate);
              let hours = Math.floor(timeDifference / 3600000); // 1 hour = 3600000 milliseconds
              let minutes = Math.floor((timeDifference % 3600000) / 60000); // 1 minute = 60000 milliseconds
          
              let LogOutDateMessage = document.createElement("p");
              LogOutDateMessage.id = "LogOutDateMessage";
              LogOutDateMessage.innerHTML = `Logout Date: ${new Date(loggingData.logOutDate).toLocaleTimeString('en-GB',{weekday: 'long', hour12: true, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit'})} <br> Total working hours: <br> (${hours} hours and ${minutes} minutes )`;
              div.append(LogOutDateMessage);
  
            }
            
          }  
      
  
        }
  



//         function loging(){

//             let LoginDate = document.createElement("p")
//             LoginDate.id="LoginDate"
//             LoginDate.innerHTML= `Login Date ${DateN}`
//             div.append(LoginDate)
//             if(LoginDate){
//               let LogOutBtn = document.createElement("button")
//               LogOutBtn.id="LogOutBtn"
//               LogOutBtn.innerHTML="Log out"

//               div.append(LogOutBtn)

//               LogOutBtn.addEventListener("click", LogOutFunction);
              
//         function LogOutFunction() {
//   let logOutDate = new Date().toLocaleTimeString();
//   let loginDate = new Date(document.getElementById("LoginDate").innerHTML.slice(12));
//   let timeDifference = Math.abs(loginDate - new Date());
//   let hours = Math.floor(timeDifference / 3600000); // 1 hour = 3600000 milliseconds
//   let minutes = Math.floor((timeDifference % 3600000) / 60000); // 1 minute = 60000 milliseconds

//   let logOutMessage = document.createElement("p");
//   logOutMessage.id = "logOutMessage";
//   logOutMessage.innerHTML = `Logout Date ${logOutDate} (${hours} hours and ${minutes} minutes after login)`;
//   div.append(logOutMessage);
// }


//         }
       


       
        
          
       
//       }
     


  
// div.addEventListener("click", resetCount);

// When the user clicks anywhere outside of the modal, close it


  //  function removeItem(){
  //   for (let i = 0; i < items.length; i++){
  //     if(items[i].id){
  //       alert("touched")
  //          items.pop();


  //     }

  //   }
    // var filt = items.filter((a,i)=>{
    //       if(del== a.id){
    //         items.splice(i,1);
    //         displayImage();
    //         localStorage.setItem("items", JSON.stringify(items) )
      
    //       }
    //     })
    
    // }
  //  source.forEach((item, i) => {
  //   item.id = i + 1;
  // });

// let countEl = document.getElementById("count-el")
// let count = 0



// function save() {
//     let countStr = count + " - "
//     saveEl.textContent += countStr
//     countEl.textContent = 0
//     count = 0
// }
// 


///////////////////////////////////////


// let items = []
// let loggingData = []


// function save() {
//    let  inputEl =document.getElementById("input-el");

// if(inputEl.value){
//     let idNo = items.length +1;



//   items.push({
//     inputEl: inputEl.value,
//     id: idNo

//   })
//   inputEl.value = ""

// localStorage.setItem('items', JSON.stringify(items));
// displayImage()
// window.location.reload();

// }

// }


//   let DataFromLocalStorage = JSON.parse(localStorage.getItem('items'));
// let dataNew = JSON.parse(localStorage.getItem('items'))
//   function entry(){
//     for(let i =0; i<dataNew.length; i++){
//         if(dataNew[i] !==null){
//             document.getElementById("noEntry").innerHTML="Saved Entries:"
//             // document.getElementById("noEntry").style.display="none"
//         } 
        
//     }
   
    
// }entry()

// if (DataFromLocalStorage) {
// items = DataFromLocalStorage

// }
// else {
//   console.log("In nodeJS");
// }

// function displayImage() {
// let savedEl = document.getElementById("save-el");

//     let liEl= ""
//     for (let i = 0; i<items.length; i++){
     
// liEl += `



// <tr >
// <div id="divTr">
// <span id="addCount-btn" onclick="createDiv(${i})"> ${items[i].inputEl}</span><span> <button id="delete-btn" onclick="removeItem(${items[i].id})"><i class="fa fa-trash"></i> </button></span>  

// </div>
// </tr>


// `

//     }
//     savedEl.innerHTML =liEl
    
//    }displayImage()

//    function removeItem(itemId) {
//     // Find the index of the item with the provided itemId
//     const index = items.findIndex(item => item.id === itemId);
    
//     // If the item exists in the array, remove it
//     if (index !== -1) {
//       items.splice(index, 1);
//       localStorage.setItem('items', JSON.stringify(items));
//       const div = document.getElementById("div");
//       if (div) {
//         div.parentNode.removeChild(div);
        
//       }
//       displayImage();
//       // quit = false;

//     }
// window.location.reload();

//   }

//   let quit = false;
//   function createDiv(index) {
//     let main = document.getElementById("CountDiv");
//     let div = document.createElement("div");
//     div.id = "div";
//     div.style.padding = "10px";
//     main.append(div);
  
//     let close = document.createElement("button");
//     close.id = "close";
//     close.innerHTML = "x";
//     div.append(close);
//     close.addEventListener("click", hideNewlyCreatedDiv);
  
//     function hideNewlyCreatedDiv() {
//       div.style.display = "none";
//       window.location.reload();
//     }
  
//     let InputElName = document.createElement("h1");
//     InputElName.innerHTML = items[index].inputEl;
//     InputElName.id = "InputElName";
//     div.append(InputElName);
  
//     if (div) {
//       let logInBtn = document.createElement("button");
//       logInBtn.id = "logInBtn";
//       logInBtn.innerHTML = "Login";
//       div.append(logInBtn);
//       logInBtn.addEventListener("click", logIn);
  
//       let loggingData = getLoggingDataFromLocalStorage();
  
//       if (loggingData.length > 0) {
//         // Display existing loggingData
//         displayLoggingData(loggingData);
//       }
  
//       function logIn() {
//         const loginTimestamp = Date.now();
//         const loginData = {
//           loginDate: loginTimestamp,
//           logOutDate: null
//         };
//         loggingData.push(loginData);
//         updateLoggingDataInLocalStorage(loggingData);
  
//         let LoginDateMessage = document.createElement("p");
//         LoginDateMessage.id = "LoginDateMessage";
//         LoginDateMessage.innerHTML = `Login Date: ${new Date(loginTimestamp).toLocaleTimeString('en-GB',{weekday: 'long', hour12: true, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit'})}`;
//         div.append(LoginDateMessage);
//       }
  
//       let LogOutBtn = document.createElement("button");
//       LogOutBtn.id = "LogOutBtn";
//       LogOutBtn.innerHTML = "Log out";
//       div.append(LogOutBtn);
  
//       LogOutBtn.addEventListener("click", logOut);
  
//       function logOut() {
//         const logoutTimestamp = Date.now();
//         const lastIndex = loggingData.length - 1;
//         loggingData[lastIndex].logOutDate = logoutTimestamp;
//         updateLoggingDataInLocalStorage(loggingData);
  
//         let timeDifference = Math.abs(logoutTimestamp - loggingData[lastIndex].loginDate);
//         let hours = Math.floor(timeDifference / 3600000);
//         let minutes = Math.floor((timeDifference % 3600000) / 60000);
//         let LogOutDateMessage = document.createElement("p");
//         LogOutDateMessage.id = "LogOutDateMessage";
//         LogOutDateMessage.innerHTML = `Logout Date: ${new Date(logoutTimestamp).toLocaleTimeString('en-GB',{weekday: 'long', hour12: true, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit'})} <br> Total working hours: <br> (${hours} hours and ${minutes} minutes )`;
//         div.append(LogOutDateMessage);
//       }
//     }
//   }
  
//   function getLoggingDataFromLocalStorage() {
//     let loggingData = localStorage.getItem('loggingData');
//     if (loggingData) {
//       return JSON.parse(loggingData);
//     }
//     return [];
//   }
  
//   function updateLoggingDataInLocalStorage(loggingData) {
//     localStorage.setItem('loggingData', JSON.stringify(loggingData));
//   }
  
//   function displayLoggingData(loggingData) {
//     let countDiv = document.getElementById("CountDiv");
//     for (let i = 0; i < loggingData.length; i++) {
//       let loginData = loggingData[i];
//       let loginDate = new Date(loginData.loginDate);
//       let logoutDate = loginData.logOutDate ? new Date(loginData.logOutDate) : null;
  
//       let loginMessage = document.createElement("p");
//       loginMessage.innerHTML = `Login Date: ${loginDate.toLocaleTimeString('en-GB',{weekday: 'long', hour12: true, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit'})}`;
  
//       countDiv.append(loginMessage);
  
//       if (logoutDate) {
//         let timeDifference = Math.abs(logoutDate - loginDate);
//         let hours = Math.floor(timeDifference / 3600000);
//         let minutes = Math.floor((timeDifference % 3600000) / 60000);
  
//         let logoutMessage = document.createElement("p");
//         logoutMessage.innerHTML = `Logout Date: ${logoutDate.toLocaleTimeString('en-GB',{weekday: 'long', hour12: true, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit'})} <br> Total working hours: <br> (${hours} hours and ${minutes} minutes )`;
  
//         countDiv.append(logoutMessage);
//       }
//     }
//   }
  
  
  // // Retrieve loggingData from localStorage
  // let loggingData = JSON.parse(localStorage.getItem('loggingData'));

  // // Display login and logout dates if available
  // if (loggingData && loggingData.loginDate) {
  //   let loginDateMessage = document.createElement("p");
  //   loginDateMessage.id = "LoginDateMessage";
  //   loginDateMessage.innerHTML = `Login Date: ${new Date(loggingData.loginDate).toLocaleTimeString('en-GB', { weekday: 'long', hour12: true, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
  //   div.append(loginDateMessage);
  // }
  // if (loggingData && loggingData.logOutDate) {
  //   let logOutDateMessage = document.createElement("p");
  //   logOutDateMessage.id = "LogOutDateMessage";
  //   logOutDateMessage.innerHTML = `Logout Date: ${new Date(loggingData.logOutDate).toLocaleTimeString('en-GB', { weekday: 'long', hour12: true, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
  //   div.append(logOutDateMessage);
  // }
  // if (loggingData && loggingData.loginDate && loggingData.logOutDate) {
  //   let timeDifference = Math.abs(loggingData.logOutDate - loggingData.loginDate);
  //   let hours = Math.floor(timeDifference / 3600000); // 1 hour = 3600000 milliseconds
  //   let minutes = Math.floor((timeDifference % 3600000) / 60000); // 1 minute = 60000 milliseconds
  //   let totalWorkingHoursMessage = document.createElement("p");
  //   totalWorkingHoursMessage.innerHTML = `Total working hours: ${hours} hours and ${minutes} minutes`;
  //   div.append(totalWorkingHoursMessage);
  // }





//         function loging(){

//             let LoginDate = document.createElement("p")
//             LoginDate.id="LoginDate"
//             LoginDate.innerHTML= `Login Date ${DateN}`
//             div.append(LoginDate)
//             if(LoginDate){
//               let LogOutBtn = document.createElement("button")
//               LogOutBtn.id="LogOutBtn"
//               LogOutBtn.innerHTML="Log out"

//               div.append(LogOutBtn)

//               LogOutBtn.addEventListener("click", LogOutFunction);
              
//         function LogOutFunction() {
//   let logOutDate = new Date().toLocaleTimeString();
//   let loginDate = new Date(document.getElementById("LoginDate").innerHTML.slice(12));
//   let timeDifference = Math.abs(loginDate - new Date());
//   let hours = Math.floor(timeDifference / 3600000); // 1 hour = 3600000 milliseconds
//   let minutes = Math.floor((timeDifference % 3600000) / 60000); // 1 minute = 60000 milliseconds

//   let logOutMessage = document.createElement("p");
//   logOutMessage.id = "logOutMessage";
//   logOutMessage.innerHTML = `Logout Date ${logOutDate} (${hours} hours and ${minutes} minutes after login)`;
//   div.append(logOutMessage);
// }


//         }
       


       
        
          
       
//       }
     


  
// div.addEventListener("click", resetCount);

// When the user clicks anywhere outside of the modal, close it


  //  function removeItem(){
  //   for (let i = 0; i < items.length; i++){
  //     if(items[i].id){
  //       alert("touched")
  //          items.pop();


  //     }

  //   }
    // var filt = items.filter((a,i)=>{
    //       if(del== a.id){
    //         items.splice(i,1);
    //         displayImage();
    //         localStorage.setItem("items", JSON.stringify(items) )
      
    //       }
    //     })
    
    // }
  //  source.forEach((item, i) => {
  //   item.id = i + 1;
  // });

// let countEl = document.getElementById("count-el")
// let count = 0



// function save() {
//     let countStr = count + " - "
//     saveEl.textContent += countStr
//     countEl.textContent = 0
//     count = 0
// }
// 