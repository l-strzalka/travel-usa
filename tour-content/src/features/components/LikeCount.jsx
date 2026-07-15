 import { useState } from "react"

 export function Counter(){
 const [liked, setLiked] = useState(false);
 const [count, setCount] = useState(0);

       const isLiked = () =>{
        if (liked) {
                setCount((prevCount) => prevCount - 1);
                setLiked(false);
        } else {
                setCount((prevCount) => prevCount + 1);
                setLiked(true)
        }
        console.log({count})
       }

 return (
    <>    
    <button onClick={isLiked}>
            {count ? "Udno like" : "Like"} {count}
    </button>
   
    </>
  )
 }




