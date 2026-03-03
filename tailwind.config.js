/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			'brand-white': {
  				'50': '#FFFFFF',
  				'100': '#F9FAFB',
  				'200': '#F3F4F6',
  				'300': '#E5E7EB',
  				'400': '#D1D5DB',
  				'500': '#9CA3AF',
  				'600': '#6B7280',
  				'700': '#374151',
  				'800': '#1F2937',
  				'900': '#111827'
  			},
  			'brand-primary': {
  				'50': '#E6EEF2',
  				'100': '#CCDDE5',
  				'200': '#99BBCB',
  				'300': '#6699B2',
  				'400': '#337798',
  				'500': '#01557F',
  				'600': '#01446C',
  				'700': '#013349',
  				'800': '#01334C',
  				'900': '#012233'
  			},
  			'brand-secondary': {
  				'50': '#FDEAEB',
  				'100': '#FBD5D7',
  				'200': '#F7ABAF',
  				'300': '#F38187',
  				'400': '#EF575F',
  				'500': '#E65056',
  				'600': '#D13339',
  				'700': '#A6292D',
  				'800': '#7A1F22',
  				'900': '#4D1416'
  			},
  			'brand-accent': {
  				'50': '#FFF1F1',
  				'100': '#FFE2E2',
  				'200': '#FFC9C9',
  				'300': '#FFA8A8',
  				'400': '#FF8787',
  				'500': '#FF6B6B',
  				'600': '#FA5252',
  				'700': '#F03E3E',
  				'800': '#E03131',
  				'900': '#C92A2A'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		animation: {
  			blob: 'blob 7s infinite',
  			marquee: 'marquee 20s linear infinite',
  			'fade-in': 'fadeIn 0.7s ease-out forwards',
  			'slide-up': 'slideUp 0.7s ease-out forwards',
  			'slide-down': 'slideDown 0.7s ease-out forwards',
  			'slide-left': 'slideLeft 0.7s ease-out forwards',
  			'slide-right': 'slideRight 0.7s ease-out forwards',
  			'scale-in': 'scaleIn 0.5s ease-out forwards',
  			'bounce-in': 'bounceIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
  			'spin-slow': 'spin 8s linear infinite',
  			'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			slideUp: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(40px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			slideDown: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(-40px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			slideLeft: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateX(-40px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateX(0)'
  				}
  			},
  			slideRight: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateX(40px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateX(0)'
  				}
  			},
  			scaleIn: {
  				'0%': {
  					opacity: '0',
  					transform: 'scale(0.9)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'scale(1)'
  				}
  			},
  			bounceIn: {
  				'0%': {
  					opacity: '0',
  					transform: 'scale(0.3)'
  				},
  				'50%': {
  					opacity: '1',
  					transform: 'scale(1.05)'
  				},
  				'70%': {
  					transform: 'scale(0.9)'
  				},
  				'100%': {
  					transform: 'scale(1)'
  				}
  			},
  			blob: {
  				'0%': {
  					transform: 'translate(0px, 0px) scale(1)'
  				},
  				'33%': {
  					transform: 'translate(30px, -50px) scale(1.1)'
  				},
  				'66%': {
  					transform: 'translate(-20px, 20px) scale(0.9)'
  				},
  				'100%': {
  					transform: 'translate(0px, 0px) scale(1)'
  				}
  			},
  			marquee: {
  				'0%': {
  					transform: 'translateX(0%)'
  				},
  				'100%': {
  					transform: 'translateX(-100%)'
  				}
  			}
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'white-gradient': 'linear-gradient(to right, #F9FAFB, #FFFFFF)'
  		},
  		boxShadow: {
  			soft: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
  			medium: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
