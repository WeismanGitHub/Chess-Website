import flowbite from 'flowbite-react/tailwind'

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/app/**/*.tsx', flowbite.content()],
    theme: {
        extend: {},
    },
    plugins: [flowbite.plugin()],
}
