'use client'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useCallback, useEffect } from "react"
import { Star } from 'lucide-react'
import { PlaylistType, RatingType } from "@/types/Types"

import addRatings from "@/app/actions/addRatings"
import getUserData from "@/app/actions/getUserData"
import getRatings from "@/app/actions/getRatings"
import { revalidatePath } from "next/cache"
import { DialogClose } from "@radix-ui/react-dialog"
import getPlaylistData from "@/app/actions/getPlaylistData"
import Rating from '@/components/Rating';
import { useOptimistic } from "react"
export default function Rate(playlist: PlaylistType) {
  const [rating, setRating] = useState<number>();
  const [optimisticPlaylist, addOptimisticPlaylist] = useOptimistic(
    playlist,
    (state, newRating: number) => ({ ...state, playlistRating: newRating })
  );
    function onChange(newValue: number) {
      console.log(newValue);
      setRating(newValue);
    }

    const onSubmit = useCallback(async () => {
      const userData: any = await getUserData();
      
      if (!userData) return null;
    
      // Optimistically update the UI
      addOptimisticPlaylist(rating || 0);
    
      try {
        const ratingData = await addRatings({
          user_id: userData.id,
          playlist_id: playlist.id || "",
          rating: rating || null
        });
    
        console.log(ratingData, 'ratingData');
        // You can handle the successful response here if needed
      } catch (error) {
        console.error('Error submitting rating:', error);
        // You might want to revert the optimistic update or show an error message
      }
    }, [rating, playlist.id, addOptimisticPlaylist]);






  
  return (
    <Dialog >
      <DialogTrigger asChild>
      <p className="text-white flex gap-1 justify-center items-center text-sm md:text-lg">
      <Star fill={optimisticPlaylist.playlistRating ? "#FAC815" : ""}  className='text-yellow-300 cursor-pointer hover:bg-gray-600 h-5 w-5 md:h-6 md:w-6' width={20} height={20} />
      {optimisticPlaylist.playlistRating ? optimisticPlaylist.playlistRating : " "}</p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#1f1f1f] ">
        <DialogHeader className="relative flex flex-col justify-center items-center gap-4">
  
           <svg 
           xmlns="http://www.w3.org/2000/svg" 
           width="80" height="80" viewBox="0 0 24 24" 
           fill='#d2861b' className="  absolute -top-16 left-36 right-36 lucide lucide-star">
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="currentColor" className=" text-[7px] text-white font-bold">
    {rating? rating: playlist.playlistRating ? playlist.playlistRating: "?"}</text>
</svg>

         <div className="flex flex-col justify-center items-center gap-2">
         <DialogTitle className="mt-4 text-[#d2861b] text-md uppercase md:text-lg">Rate this</DialogTitle>
         <DialogTitle className="text-white text-lg md:text-xl">{playlist.playlist_title}</DialogTitle>
         </div>
          <DialogDescription>
            {/* (
          <Rating
          
          style={{ maxWidth: 360, outline:"none", width:20 }}
          value={rating || playlist.playlistRating!}
          items={10}
          className="flex flex-row"
        
          onChange={onChange}
          transition="zoom"
        />
            ) */
            }

<Rating 
        initialRating={rating || playlist.playlistRating} 
        onChange={onChange}
      />
        
       
       

          </DialogDescription>
        </DialogHeader>
       
        <DialogFooter>
          <DialogClose className="self-center text-md md:text-lg w-full">
          <Button  onClick={ onSubmit} className="self-center text-md md:text-lg w-full mt-2 bg-[#313131] hover:bg-[#3e3a3a]" type="submit">Rate This</Button>

          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
