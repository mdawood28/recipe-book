/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./views/**/*.ejs",
        "./public/**/*.js"
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['"Inter"', 'sans-serif'],
            },
            colors: {
                cream: {
                    50: '#FDFBF7',
                    100: '#F9F5EE',
                },
                charcoal: '#2D2D2D',
                accent: {
                    light: '#FF8A66',
                    DEFAULT: '#E05A33',
                    dark: '#C2411C'
                }
            }
        },
    },
    plugins: [],
}