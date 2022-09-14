import React from 'react';
import { Modal, Typography, Button, ButtonGroup, Grid, Box, CircularProgress, useMediaQuery, Rating } from '@mui/material';
import { Movie as MovieIcon, Theaters, Language, PlusOne, Favorite, FavoriteBorderOurlined, Remove, ArrowBack } from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import { MovieList } from '..';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMovieQuery, useGetRecomendationsQuery } from '../../services/TMDB';
import axios from 'axios';
import useStyles from './styles';

const MovieInformation = () => {
	const {id} = useParams();
	const {data, isFetching, error} = useGetMovieQuery(id);
	const classes = useStyles();

	const {data:recomendations, isFetching: isRecomendationsFetching} = useGetRecomendationsQuery({list:'recommendations', movie_id: id});

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
					alt={data?.title}
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
					{data && data.credits?.cast?.map((character, i) => (
						character.profile_path && (
							<Grid key={i} item xs={4} md={2} component={Link} to={`/actors/${character.id}`} style={{textDecoration: 'none'}}>
								<img className={classes.castImage} src={`${process.env.REACT_APP_TMDB_BASE_POSTER_URL}/${character.profile_path}`} alt={character.name} />
								<Typography color='textPrimary'>{character.name}</Typography>
							</Grid>
						))).slice(0,6)}
				</Grid>
			</Grid>

			{recomendations && (
			<Box marginTop='5rem' width='100%'>
				<Typography variant="h3" gutterBottom align="center">
					You might also like
				</Typography>
				<MovieList movies={recomendations} numberOfMovies={12} />
			</Box>
			)}

		</Grid>
	);
};

export default MovieInformation;