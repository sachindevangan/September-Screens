// utils/tmdb.js
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

function cleanTitle(title) {
  return title
    .replace(/\(\d{4}.*?\)/, "")   // remove (1995) or (1995, Studio Ghibli)
    .replace(/\d{4}/, "")          // remove stray years
    .replace(/[,.:]/g, "")         // remove commas, dots, colons
    .replace(/\s+/g, " ")          // collapse extra spaces
    .trim();
}


export async function fetchMovieFromTMDB(title) {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const query = cleanTitle(title);

  try {
    const searchRes = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );
    const searchData = await searchRes.json();

    if (!searchData.results.length) {
      console.warn("No results for:", query);
      return null;
    }

    const movieId = searchData.results[0].id;

    const detailsRes = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`
    );
    const details = await detailsRes.json();

    const trailer = details.videos?.results.find(
      v => v.type === "Trailer" && v.site === "YouTube"
    );

    return {
      title: details.title,
      year: details.release_date ? details.release_date.split("-")[0] : null,
      overview: details.overview,
      tagline: details.tagline,
      runtime: details.runtime,
      genres: details.genres?.map(g => g.name) || [],
      rating: details.vote_average,
      votes: details.vote_count,
      poster: details.poster_path
        ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
        : null,
      trailer: trailer ? `https://www.youtube.com/embed/${trailer.key}` : null,
      director: details.credits?.crew?.find(c => c.job === "Director")?.name,
      cast: details.credits?.cast?.slice(0, 3).map(c => c.name),
    };
  } catch (err) {
    console.error("TMDB fetch error:", err);
    return null;
  }
}

