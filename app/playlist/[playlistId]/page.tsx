import React from "react";
import playlists from "@/playlist.json";
import PlaylistCard from "@/components/PlaylistCard";
import Image from "next/image";
import { Star, Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import getPlaylistData from "@/app/actions/getPlaylistData";
import Rate from "@/components/Rate";
import getRatings from "@/app/actions/getRatings";
import PlaylistCards from "@/components/PlaylistCards";
import getUserData from "@/app/actions/getUserData";
import { redirect } from "next/navigation";
import { PlaylistType } from "@/types/Types";


type EnrichedPlaylistType = PlaylistType & {
  playlistRating: number | null;
  avgPlaylistRate: string | null;
};

const PlaylistDetail = async ({
  params,
}: {
  params: { playlistId: string };
}) => {
  const userData = await getUserData();
  
  if (!userData) {
    redirect('/signup');
  }  

  const dataPlaylist = await getPlaylistData();
  const ratings = await getRatings();

  if (!dataPlaylist || !ratings) return null;

  const enrichedPlaylists: EnrichedPlaylistType[] = dataPlaylist.map(playlist => ({
    ...playlist,
    playlistRating: ratings.find(r => r.playlist_id === playlist.id)?.rating || null,
    avgPlaylistRate: playlist.playlist_rates?.toFixed(1) || null
  }));

  const selectedPlaylist = enrichedPlaylists.find(pl => pl.id === params.playlistId);

  if (!selectedPlaylist) {
    return <p className="flex justify-around items-center text-xl">Playlist not found.</p>;
  }
  const filteredPlaylists = enrichedPlaylists.filter(pl => pl.id !== params.playlistId);
  const sortedPlaylists = filteredPlaylists.sort((a, b) => Number(b.avgPlaylistRate) - Number(a.avgPlaylistRate));


  return (
    <div className="bg-[#0E0E0E] w-full min-h-screen">
      <div className="md:container mx-auto md:px-8 md:py-8 flex flex-col gap-14 md:gap-0 md:flex-row justify-between">
        <div className="w-full max-w-3xl px-3 felx flex-col">
          <div className="relative">
            <Image
              src={selectedPlaylist.playlist_image}
              alt={selectedPlaylist.playlist_title}
              width={300}
              height={300}
              className="w-full object-fit mb-4 rounded-xl"
            />
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
              <Link href={selectedPlaylist.playlist_url!} target="_blank">
                <Image src="/play.svg" alt="play" width={100} height={100} />
              </Link>
            </div>
          </div>
          <div className="flex flex-row justify-around md:justify-normal md:gap-8 items-center justify-self-auto md:pl-6 -mt-2 max-w-2xl">
            <span className="text-sm md:text-xl self-start text-[#D9D9D9]">
              {selectedPlaylist.playlist_title}
            </span>

            <span className="flex text-[#D9D9D9] justify-center items-center text-sm md:text-xl gap-2">
              <Star
                fill="#FAC815"
                className="text-yellow-300 h-5 w-5 md:h-6s md:w-6"
                width={25}
                height={25}
              />
              {selectedPlaylist.playlist_rates?.toFixed(1) || 0.0}
            </span>
            <Rate {...selectedPlaylist} playlistRating={selectedPlaylist.playlistRating!} />
            {/* <div className="flex flex-row justify-center items-center gap-2">
              <span className="text-sm md:text-lg text-gray-400 ">2.1k</span>
              <Eye className="text-gray-400 h-5 w-5 md:h-6 md:w-6 " width={25} height={25} />
            </div> */}
          </div>
          <div className="userInfo flex flex-row gap-4 justify-start mt-8 pl-4 md:pl-6">
            <Avatar>
              <AvatarImage
                src={selectedPlaylist.user_profile_image_link}
                alt="profile"
              />
              <AvatarFallback className="text-white">
                <Image
                  src="/default-profile.jpg"
                  alt="profile"
                  width={200}
                  height={200}
                />
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col  gap-4 w-full ">
              <div>
                <h1 className="text-xs md:text-sm font-medium text-gray-400">
                  Created by
                </h1>
                <Link href={selectedPlaylist.user_profile_link!} target="_blank">
                <h1 className="text-sm md:text-lg text-white">
                  {selectedPlaylist.user_name}
                </h1>
                </Link>
              </div>
              <p className="text-white text-sm bg-[#3F3F3F] md:p-4 w-42 p-2 text-start -ml-16 md:w-full h-3/4 max-h-full md:-ml-12 rounded-lg ">
                {selectedPlaylist.playlist_summary}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 px-2 md:px-6">
          <h1 className="text-md md:text-xl w-2/3 self-center text-white text-center p-2 rounded-full border border-purple-400">
            Most Rated Playlists
          </h1>

          <div className="h-screen no-scrollbar overflow-y-scroll">
            <PlaylistCards
              className="grid grid-cols-1 gap-8"
              playlistData={sortedPlaylists}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetail;
