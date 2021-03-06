const {
	generateResponsiveScreens,
	generatePixelRules,
	generateRemRules,
	generateIntRules,
	flexPlugin,
	transitionPlugin,
	truncatePlugin,
	containerPlugin,
	generateColumnRules,
} = require('@learnthis/tailwind-utils');

const colors = {
	bg: {
		700: '#1d1e26',
		DEFAULT: '#2b2b36',
		300: '#353641',
	},
	bgalt: {
		700: '#563DFF',
		DEFAULT: '#694EFF',
		300: '#9683FF',
	},
	primary: {
		700: '#028DF1',
		DEFAULT: '#039FF4',
		300: '#4FBCF7',
	},
	secondary: {
		700: '#542CA7',
		DEFAULT: '#673AB7',
		300: '#9575CD',
	},
	accent: {
		700: '#FFC800',
		DEFAULT: '#FFD300',
		300: '#FFE04D',
	},
	error: {
		700: '#C22525',
		DEFAULT: '#CE3131',
		300: '#DD6F6F',
	},
	warning: {
		700: '#FAB800',
		DEFAULT: '#FBC500',
		300: '#FCD64D',
	},
	success: {
		700: '#0EA163',
		DEFAULT: '#13B176',
		300: '#5AC89F',
	},
	gray: {
		700: '#6D7A8C',
		DEFAULT: '#808D9E',
		300: '#A6AFBB',
	},
	blue: {
		700: '#2F52BA',
		DEFAULT: '#2F52BA',
		300: '#2F52BA',
	},
	orange: {
		700: '#F57800',
		DEFAULT: '#F78B00',
		300: '#F9AE4D',
	},
	pink: {
		700: '#FF498D',
		DEFAULT: '#FF5B9F',
		300: '#FF8CBC',
	},
	white: {
		DEFAULT: '#FFFFFF',
	},
	black: {
		DEFAULT: '#000000',
	},
	transparent: {
		DEFAULT: '#00000000',
	},
	overlay: {
		DEFAULT: '#232A3BEB',
	},

	// Social
	google: {
		700: '#E7E7E7',
		DEFAULT: '#FEFEFF',
	},
	github: {
		700: '#101419',
		DEFAULT: '#161B22',
	},
	gitlab: {
		700: '#443575',
		DEFAULT: '#554488',
	},
	twitch: {
		700: '#493172',
		DEFAULT: '#5B3F85',
	},
	discord: {
		700: '#4753EE',
		DEFAULT: '#5865F2',
	},
};

const standardRemValues = {
	...generateRemRules(0, 5, 0.125),
	...generateRemRules(5, 10, 0.25),
	...generateRemRules(10, 25, 0.5),
	...generateRemRules(25, 100, 1),
};

const breakpoints = {
	xs: 450,
	sm: 768,
	md: 1024,
	lg: 1280,
};

module.exports = {
	content: ['./src/**/*.tsx'],
	theme: {
		colors,
		screens: generateResponsiveScreens(
			breakpoints.xs,
			breakpoints.sm,
			breakpoints.md,
			breakpoints.lg
		),
		borderWidth: generatePixelRules(0, 10),
		fontSize: generatePixelRules(10, 60),
		fontFamily: {
			text: ['Poppins', 'sans-serif'],
		},
		maxWidth: {
			auto: 'auto',
			screen: '100vw',
			full: '100%',
			...standardRemValues,
		},
		minHeight: {
			auto: 'auto',
			screen: '100vh',
			full: '100%',
			...standardRemValues,
		},
		minWidth: {
			auto: 'auto',
			screen: '100vw',
			full: '100%',
			...standardRemValues,
		},
		spacing: standardRemValues,
		zIndex: generateIntRules(0, 100),
		extend: {
			padding: {
				full: '100%',
			},
			height: {
				auto: 'auto',
				screen: '100vh',
				full: '100%',
				...generateColumnRules([2, 3, 4, 5, 6, 8, 10, 12]),
			},
			width: {
				auto: 'auto',
				screen: '100vw',
				full: '100%',
				...generateColumnRules([2, 3, 4, 5, 6, 8, 10, 12]),
			},
			maxHeight: {
				auto: 'auto',
				screen: '100vh',
				full: '100%',
			},
		},
	},
	plugins: [
		flexPlugin(['responsive']),
		transitionPlugin(0, 2000, 125),
		truncatePlugin(20),
		containerPlugin(breakpoints),
	],
};
