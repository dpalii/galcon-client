# Galcon client
Galacon client - client for galcon game

## Description
The Galacon client is a React-based frontend component that seamlessly integrates with a compatible server application. It provides users with an intuitive and modern user interface to interact with the Galacon system. The client-server communication enables efficient data exchange and real-time updates, enhancing the overall event management experience.

The api interfaces can be found at [https://github.com/0rqheus/galcon#readme](https://github.com/0rqheus/galcon#readme).

## Setup

This project needs backend service to operate correctly

1) clone [https://github.com/0rqheus/galcon](https://github.com/0rqheus/galcon) to your local machine
2) start the server
3) open client folder
4) change the defaul react port to witch you like to not run on servers port
5) install npm globally
6) open terminal in client folder
7) type `npm i` to install dependencies

## Run app

After setup is complete navigate to project folder and run following command:\
`npm start`

It runs the app in the development mode.\
After these commands a tab with game will be opened in your browser.\
You can access it directly by going to [http://localhost:3006](http://localhost:3006)

## Other Scripts

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### `npm run lint`

Run to check whether code satisfies eslint config
The default config is extended from:

        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "airbnb", "airbnb/hooks"


## Gameplay preview
<img width="529" alt="Screenshot 2023-06-06 at 20 09 37" src="https://github.com/dpalii/galacon-client/assets/47571050/7eaa9776-e101-4787-9107-e29575fd1269">

A picture with the game for 2 players.
