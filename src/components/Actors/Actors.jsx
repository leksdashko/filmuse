import React, { useState } from 'react';
import { Typography, Button, Grid, Box, CircularProgress } from '@mui/material';
import { Link, useHistory, useParams } from 'react-router-dom';
import { MovieList, Pagination } from '..';
import { useGetActorQuery, useGetMoviesByActorIdQuery } from '../../services/TMDB';
import useStyles from './styles';

const Actors = () => {
	const {id} = useParams();
	const {data, isFetching, error} = useGetActorQuery(id);
	const classes = useStyles();
	const history = useHistory();
	const [page, setPage] = useState(1);

	const {data:movieList} = useGetMoviesByActorIdQuery({actor_id: id, page});

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
					src={`${process.env.REACT_APP_TMDB_BASE_POSTER_URL}${data?.profile_path}`}
					alt={data?.title}
				/>
			</Grid>
			<Grid item container direction="column" lg={7}>
				<Typography variant='h3' align='center' gutterBottom>
					{data?.name}
				</Typography>
				<Typography variant='h5' align='center' gutterBottom>
					Born: {new Date(data?.birthday).toDateString()}
				</Typography>
				<Typography style={{marginBottom: '2rem'}}>
					{data?.biography}
				</Typography>
			</Grid>

			<Grid item container style={{marginTop: '2rem'}}>
				<div>
					<Grid>
						<Button target="_blank" href={`https://www.imdb.com/name/${data.imdb_id}`}>IMDB</Button>
						<Button onClick={() => history.goBack() }>Go Back</Button>
					</Grid>
				</div>
			</Grid>

			{movieList && (
			<Box marginTop='5rem' width='100%'>
				<Typography variant="h3" gutterBottom align="center">
					Movies
				</Typography>
				<MovieList movies={movieList} numberOfMovies={12} />
				<Pagination currentPage={page} setPage={setPage} totalPages={movieList.total_pages} />
			</Box>
			)}
		</Grid>
	);
};

export default Actors;