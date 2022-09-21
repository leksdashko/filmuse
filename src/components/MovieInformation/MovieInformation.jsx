import React, { useEffect, useState } from 'react';
import { Modal, Typography, Button, ButtonGroup, Grid, Box, CircularProgress, useMediaQuery, Rating } from '@mui/material';
import { Link, useHistory, useParams } from 'react-router-dom';
import { MovieList } from '..';
import { useGetListQuery, useGetMovieQuery, useGetRecomendationsQuery } from '../../services/TMDB';
import axios from 'axios';
import useStyles from './styles';
import { useSelector } from 'react-redux';
import { userSelector } from '../../features/auth';

const MovieInformation = () => {
	const {user} = useSelector(userSelector);
	const {id} = useParams();
	const {data, isFetching, error} = useGetMovieQuery(id);
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const history = useHistory();

	const [isMovieFavorited, setMovieFavorited] = useState(false);
	const [isMovieWatchListed, setMovieWatchListed] = useState(false);

	const {data: watchlistMovies} = useGetListQuery({listName: 'watchlist/movies', accountId: user.id, session_id: localStorage.getItem('session_id'), page: 1});
	const {data: favoriteMovies} = useGetListQuery({listName: 'favorite/movies', accountId: user.id, session_id: localStorage.getItem('session_id'), page: 1});

	const {data:recomendations, isFetching: isRecomendationsFetching} = useGetRecomendationsQuery({list:'recommendations', movie_id: id});

	useEffect(() => {
		setMovieFavorited(!!favoriteMovies?.results.find(movie => movie?.id === data?.id));
	}, [favoriteMovies, data]);

	useEffect(() => {
		setMovieWatchListed(!!watchlistMovies?.results.find(movie => movie?.id === data?.id));
	}, [watchlistMovies, data]);

	const addToFavorites = async () => {
		await axios.post(`${process.env.REACT_APP_BASE_API_URL}/account/${user.id}/favorite?api_key=${process.env.REACT_APP_TMDB_KEY}&session_id=${localStorage.getItem('session_id')}`, {
			media_type: 'movie',
			media_id: id,
			favorite: !isMovieFavorited
		});

		setMovieFavorited(prev => !prev);
	}

	const addToWatchList = async () => {
		await axios.post(`${process.env.REACT_APP_BASE_API_URL}/account/${user.id}/watchlist?api_key=${process.env.REACT_APP_TMDB_KEY}&session_id=${localStorage.getItem('session_id')}`, {
			media_type: 'movie',
			media_id: id,
			watchlist: !isMovieWatchListed
		});

		setMovieWatchListed(prev => !prev);
	}

	if(isFetching){
		return (
			<Box display="flex" justifyContent="center" alignItems="center">
				<CircularProgress size="8rem"/>
			</Box>
		);
	}

	if(error){
		return (
			<Box display="flex" justifyContent="center" alignItems="center">
				<Link to="/">Something has gone wrong - Go Back</Link>
			</Box>
		);
	}

	return (
		<Grid container className={classes.containerSpaceAround}>
			<Grid item lg={4} sm={12}>
				<img 
					className={classes.poster}
					src={`${process.env.REACT_APP_TMDB_BASE_POSTER_URL}${data?.poster_path}`}
					alt={data?.name}
				/>
			</Grid>
			<Grid item container direction="column" lg={7}>
				<Typography variant='h3' align='center' gutterBottom>
					{data?.title} ({data?.release_date.split('-')[0]})
				</Typography>
				<Typography variant='h5' align='center' gutterBottom>
					{data?.tagline}
				</Typography>
				<Grid item className={classes.containerSpaceAround}>
					<Box display="flex" align="center">
						<Rating readOnly value={data?.vote_average / 2}/>
						<Typography variant="subtitle1" gutterBottom style={{marginLeft: '10px'}}>
						 {data?.vote_average} / 10
						</Typography>
					</Box>
				</Grid>
				<Typography variant='h5' gutterBottom style={{marginTop: '10px'}}>
					Overview
				</Typography>
				<Typography style={{marginBottom: '2rem'}}>
					{data?.overview}
				</Typography>
				<Typography variant='h5'>
					Top Cast
				</Typography>
				<Grid item container spacing={2}>
					{data && data.credits?.cast?.slice(0,6).map((character, i) => (
						character.profile_path && (
							<Grid key={i} item xs={4} md={2} component={Link} to={`/actors/${character.id}`} style={{textDecoration: 'none'}}>
								<img className={classes.castImage} src={`${process.env.REACT_APP_TMDB_BASE_POSTER_URL}/${character.profile_path}`} alt={character.name} />
								<Typography color='textPrimary'>{character.name}</Typography>
							</Grid>
						)))}
				</Grid>
			</Grid>

			<Grid item container style={{marginTop: '2rem'}}>
				<div>
					<Grid>
						<Button onClick={() => setOpen(true)}>Trailer</Button>
						<Button onClick={() => history.goBack()}>Go Back</Button>
						<Button onClick={addToWatchList}>{isMovieWatchListed?'Remove from Watchlist':'Add to Watchlist'}</Button>
						<Button onClick={addToFavorites}>{isMovieFavorited?'Remove from Favorite':'Add to Favorite'}</Button>
					</Grid>
				</div>
			</Grid>

			{recomendations && (
			<Box marginTop='5rem' width='100%'>
				<Typography variant="h3" gutterBottom align="center">
					You might also like
				</Typography>
				<MovieList movies={recomendations} numberOfMovies={12} />
			</Box>
			)}

			{data?.videos?.results?.length > 0 && (
				<Modal 
					closeAfterTransition
					className={classes.modal} 
					open={open}
					onClose={() => setOpen(false)}
				>
					<iframe 
						autoPlay
						className={classes.video}
						frameBorder="0"
						title="Trailer"
						src={`https://www.youtube.com/embed/${data.videos.results[0].key}`}
						allow="autoplay"
					/>
				</Modal>
			)}
		</Grid>
	);
};

export default MovieInformation;