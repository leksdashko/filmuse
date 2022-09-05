import axios from 'axios';

const TOKEN_URL = '/authentication/token/new';
const SESSION_URL = '/authentication/session/new';

export const moviesApi = axios.create({
	baseURL: process.env.REACT_APP_BASE_API_URL,
	params: {
		api_key: process.env.REACT_APP_TMDB_KEY
	}
});

export const fetchToken = async () => {
	try{
		const {data} = await moviesApi.get(TOKEN_URL);
	
		const token = data.request_token;

		if(data.success){
			localStorage.setItem('request_token', token);

			window.location.href = `https://themoviedb.org/authenticate/${token}?redirect_to=${window.location.origin}/approved`;
		}
	}catch(e){
		console.log('Sorry, your token could not be created');
	}
}

export const createSessionId = async () => {
	const token = localStorage.getItem('request_token');

	if(token){
		try{
			const {data: {session_id}} = await moviesApi.post(SESSION_URL, {
				request_token: token
			});
	
			localStorage.setItem('session_id', session_id);
	
			return session_id;
		}catch(error){
			console.log(error);
		}
	}
}