import React, { useEffect, useState } from 'react';
import axios from './axios';
import requests from './requests';
import './Row.css'
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';

const base_url = "https://images.tmdb.org/t/p/original/"

function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    useEffect(() => {
        // if [], run once when the row loads, and dont run again
        async function fetchData() {
            const request = await axios.get(fetchUrl)
            //console.log(request.cata.results)
            setMovies(request.data.results)
            return request;
        }
        fetchData();
    }, [fetchUrl])

    const opts = {
        height: '390',
        width: '100%',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
        },
      };
    console.log(movies);
    
    const handleClick = (movie)=>{
        if(trailerUrl){
            setTrailerUrl('');
        }else{
            movieTrailer(movie?.name || "")
            .then((url)=>{
                const urlParams = new URLSearchParams(new URL(url).search)
                //urlParams.get('v')
                setTrailerUrl(urlParams.get("v"))
            }).catch(error => console.log(error));
        }
    }

    return (
        <div className="row">
            {/* title */}
            <h2>{title}</h2>

            <div className="row_posters">
                {/* several row_posters(s) */}
                {movies.map(movie => (
                    <img
                        key={movie.id}
                        onClick={()=> handleClick(movie)}
                        className={`row_poster ${isLargeRow && "row_posterLarge"}`}
                        src={`${base_url}${isLargeRow ? movie.poster_path: movie.backdrop_path}`} alt={movie.name} />
                ))}
            </div>
            {/* container -> posters */}
                {trailerUrl && <YouTube videoId={trailerUrl} opts={opts}/> }
        </div>
    )
}

export default Row
