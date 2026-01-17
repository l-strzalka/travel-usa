 import { useState } from "react"

 export function Counter(){
 const [liked, setLiked] = useState(false);
 const [count, setCount] = useState(0);

       const isLiked = () =>{
        if (liked) {
                setCount(count - 1);
                setLiked(false);
        } else {
                setCount(count + 1);
                setLiked(true)
        }
       }

 return (
    <>    
    <button onClick={isLiked}>
            {count ? "Udno like" : "Like"} {count}
    </button>
   
    </>
  )
 }




