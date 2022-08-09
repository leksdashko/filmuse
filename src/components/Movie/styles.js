import { makeStyles } from "@mui/styles";

export default makeStyles((theme) => ({
	moviesContainer: {
		movie: '10px'
	},
	title: {
		color: theme.palette.text.primary,
		textOverflow: 'ellipsis',
		width: '230px',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		marginTop: '10px',
		marginBottom: '0',
		textAlign: 'center'
	}
}));