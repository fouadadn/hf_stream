'use client'
import api from '@/app/utils/axiosInstance';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css/pagination";
import 'swiper/css';
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { useEffect, useState } from 'react';
import { Bookmark, CirclePlay, Play } from 'lucide-react';
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from 'next/link';
import { useTvContext } from '@/app/context/idContext';
import { useRouter } from 'next/navigation';
import useAddToWishList from '@/app/Hooks/useAddToWishList';
import { GoBookmarkSlash } from "react-icons/go";
import axios from 'axios';
import authe from '@/app/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import useDeleteFromWishList from '@/app/Hooks/useDeleteFromWishList';
import apiForHf from '@/app/utils/axiosInstanceForHfApi';

const HomePageSlider = ({ shows }) => {

  const [data, setData] = useState([]);
  const [imgSrc, setImgSrc] = useState(`https://image.tmdb.org/t/p/original`);
  const [screenWidth, setScreenWidth] = useState(0)
  const [show5WithTrailler, setShow5WithTrailler] = useState([])
  const { id, changeId, providerId, slugify, currentUser, whishlistChange, setwhishlistChange } = useTvContext()
  const router = useRouter();
  const [checks, setChecks] = useState([])
  const UseDeleteFromWishList = useDeleteFromWishList();
  const UseAddToWishList = useAddToWishList()


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authe, async (user) => {
      // if (user) {
      try {
        const token = await user?.getIdToken(true);
        const datas = (await api.get("/trending/all/day")).data.results;
        setData(shows ? shows : datas);

        const results = await Promise.all(
          (shows ? shows : datas).filter(v => v.media_type !== 'person').slice(0, 5).map(async (v) => {
            const response = await api.get(`/${v?.media_type}/${v?.id}/videos`);

            const ifSaved = user && (await apiForHf.get(`/api/wishlist/check/${v.id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              }
            })).data;

            const trailer = response.data?.results?.find(
              (vid) => vid.type === "Trailer" && vid.site === "YouTube"
            );

            return { ...v, trailler: trailer, ifSaved: ifSaved };
          })
        );

        setShow5WithTrailler(results);
      } catch (err) {
        console.error("Error fetching movies or wishlist:", err);
      }
      // } else {
      //   console.warn("User is not authenticated");
      // }
    });

    setScreenWidth(window.innerWidth);
    const resize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      unsubscribe(); // clean up Firebase listener
    };
  }, [shows, providerId]);


  const handleError = () => {
    setImgSrc("/assets/black_backdrop.png");
  };

  return (
    <div className='w-full -mt-[81px] z-10 text-white'>
      <Swiper
        className='relative pb-5'
        modules={[Navigation, Pagination, Autoplay]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        spaceBetween={1}
        slidesPerView={1}
        pagination={{ clickable: true }}
      // onSlideChange={() => console.log('slide change')}
      // onSwiper={async (swiper) => {
      //   const { data } = await api.get("/movie/1233575")
      //   // console.log(data)
      // }}
      >
        {
          (show5WithTrailler.length > 0 ? show5WithTrailler : data).length > 0 ? (show5WithTrailler.length > 0 ? show5WithTrailler : data.slice(0, 5)).map((show) =>
            <SwiperSlide >
              <div className='relative w-full h-[621px] md:h-auto '>
                <img src={imgSrc.toString().startsWith('https') ? `${imgSrc}${screenWidth > 800 ? show?.backdrop_path : show?.poster_path}` : imgSrc} onError={handleError}
                  alt={show?.title ? show.title : show.name}
                  // Ensures it takes full width and scales height
                  width={1920}        // Set an arbitrary width
                  height={1080}
                  style={{
                    objectFit: "cover", // Use CSS to set objectFit
                    objectPosition: "center", // Optional, if you need to control the position of the image
                  }}
                  // fill
                  className='min-h-96 ' />
                {/* <img src={`https://image.tmdb.org/t/p/original/${show?.backdrop_path}` } alt="backdrop image" className='w-full brightness-90' /> */}
                <Link
                  href={`/${show.media_type}/${show.title ? slugify(show?.title) : slugify(show?.name)}`}
                  onClick={() => changeId(show?.id)}
                  className='bg-gradient-to-t from-black to-transparent  bg-[linear-gradient(to_top,black_15%,transparent_80%)] absolute top-0 bottom-0 right-0 left-0'></Link>
                <div className='absolute z-[999] text-start bottom-4 lg:bottom-44 mx-4 '>
                  <span className='bg-black px-3 py-1 rounded-full mb-5 inline-block capitalize'>{show.media_type}</span>
                  <h1 className='text-3xl md:text-5xl font-bold'>{show?.title ? show.title : show.name}</h1>
                  <span className='block md:mt-2'>{show.release_date ? show.release_date : show.first_air_date} </span>
                  <p className='w-[350px] md:w-[460px] text-sm mb-2'>{String(show.overview).split(' ').slice(0, 40).length < String(show.overview).split(" ").length ? `${String(show.overview).split(' ').slice(0, 20).join(" ")} ...` : show.overview}</p>
                  <div className='flex gap-3'>
                    <Link
                      href={`/${show.media_type}/${show.title ? slugify(show?.title) : slugify(show?.name)}`}
                      onClick={() => changeId(show?.id)}

                      className=' rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200 bg-[#5c00cc]'><Play /> <span>Play Now</span> </Link>
                    <Link href={`/watch/${show?.trailler?.key}`} className=' rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200 bg-[#37007a98]'><CirclePlay /> <span>Watch Trailer</span></Link>
                    <button onClick={
                      async () => {

                        if (currentUser) {
                          if (show?.ifSaved) {
                            UseDeleteFromWishList(show?.id)
                            setShow5WithTrailler((prev) =>
                              prev.map((item) =>
                                item.id === show.id ? { ...item, ifSaved: false } : item
                              )
                            );
                          } else {
                            UseAddToWishList(show?.id, show?.title ? show?.title : show?.name, show?.backdrop_path, show?.genre_ids, show?.vote_average, show?.media_type, show?.poster_path)
                            setShow5WithTrailler((prev) =>
                              prev.map((item) =>
                                item.id === show.id ? { ...item, ifSaved: true } : item
                              )
                            );
                          }
                        } else {
                          router.push('/auth/sign-up')
                        }


                      }
                    } style={{ backgroundColor: "#ffffff20" }} className='cursor-pointer rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200'>
                      {
                        show?.ifSaved ? <GoBookmarkSlash size={24} /> : <Bookmark />}

                    </button>
                  </div>
                </div>

              </div>
            </SwiperSlide>
          ) : <div className='flex justify-center items-center h-screen '>
            <div className='border-[1px] animate-spin w-10 h-10 rounded-full border-t-0 border-l-0'></div>
          </div>
        }


      </Swiper>

    </div >
  )
}

export default HomePageSlider
