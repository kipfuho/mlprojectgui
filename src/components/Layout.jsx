import { useState, useMemo, createContext } from 'react';
import IconButton from '@mui/material/IconButton';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { grey, amber } from '@mui/material/colors';
import ParticleBackground from './ParticleBackground';
import { Outlet } from 'react-router-dom';
import { Button } from '@mui/material';

const ColorModeContext = createContext({ toggleColorMode: () => {} });

export default function Layout(){
	const [mode, setMode] = useState('light');
	const [particleMode, setParticleMode] = useState(true);
	const colorMode = useMemo(
		() => ({
			toggleColorMode: () => {
				setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
			},
		}),
		[],
	);

  	const theme = useMemo(
		() =>
			createTheme({
				palette: {
				mode,
				...(mode === 'light'
					? {
						// palette values for light mode
						primary: {
							300: "#343843",
							400: "#292c35",
							500: "#1e2027", 
							600: "#131418",
						},
						divider: amber[200],
						text: {
							primary: "#000000",
							secondary: grey[800],
						},
						background: {
							secondary: "#EEEEEE"
						},
						action: {
							hoverOpacity: 0.2
						}
					}
					: {
						// palette values for dark mode
						primary: {
							300: "#d8d8d8",
							400: "#cbcbcb",
							500: "#bebebe",
							600: "#b1b1b1"
						},
						divider: amber[200],
						background: {
							default: "#292C35",
							primary: grey[500],
							secondary: "#343843",
						},
						text: {
							primary: '#BEBEBE',
							secondary: grey[500],
						},
						action: {
							hoverOpacity: 0.2
						}
					}),
				},
			}),
		[mode],
  	);

	return(
		<>
			<ColorModeContext.Provider value={colorMode}>
				<ThemeProvider theme={theme}>
					{particleMode && <ParticleBackground linkColor={theme.palette.text.primary}/>}
					<div className='flex flex-col p-1 transition-colors' style={{backgroundColor: theme.palette.background.default, color: theme.palette.text.primary}}>
						<h1 className='flex w-[100vw] h-[10vh] fixed top-0 z-50 items-center border-b-2' style={{background: theme.palette.background.secondary}}>
							<div className='flex flex-grow justify-center h-[3.5rem] ml-[15rem] border-gray-500 rounded-[1rem] mx-5 p-2'>
								<Button variant="outlined" sx={{paddingX: 3, marginX: 1, borderRadius: 5, background: theme.palette.background.secondary}}>About</Button>
								<Button variant="outlined" sx={{paddingX: 3, marginX: 1, borderRadius: 5, background: theme.palette.background.secondary}}>Demo</Button>
								<Button variant="outlined" sx={{paddingX: 3, marginX: 1, borderRadius: 5, background: theme.palette.background.secondary}}>References</Button>
							</div>
							<div className='w-[10rem] mr-8'>
								<div className='flex group items-center justify-end'>
									<span className='text-[0.01rem] mr-1 font-semibold transition-all transform opacity-0 translate-x-10 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-[1rem]'>{theme.palette.mode === 'light' ? "Light" : "Dark"} mode</span>
									<IconButton
										sx={{
											color:'inherit',
										}}
										onClick={colorMode.toggleColorMode}
									>
										{theme.palette.mode === 'dark' ? <Brightness7Icon sx={{ fontSize:25}}/> : <Brightness4Icon sx={{ fontSize:25}}/>}
									</IconButton>
								</div>
								<div className='flex flex-grow group items-center justify-end'>
									<span className='text-[0.01rem] mr-1 font-semibold transition-all transform opacity-0 translate-x-10 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-[1rem]'>Particle mode</span>
									<IconButton
										sx={{
											color:'inherit',
										}}
										onClick={() => setParticleMode(particleMode ? false : true)}
									>
										{particleMode ? <StarIcon/> : <StarBorderIcon/>}
									</IconButton>
								</div>
							</div>
						</h1>
						<span className='h-[10vh]'/>
						<Outlet context={theme}/>
						<p className='text-center'>
							This is footer
						</p>
					</div>
				</ThemeProvider>
			</ColorModeContext.Provider>
		</>
	)
}