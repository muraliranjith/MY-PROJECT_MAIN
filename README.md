# ottl_saas_nodejs_server

Before you can start building new app idea, you'll need to set up a few things first. 

1. Install Node.js : 
- Head over to [nodejs.org](nodejs.org) and download and install the latest version.
- Install Node Package Manager (NPM) - NPM is a huge repository of code modules that you can download and use in your projects. This app relies on several third-party libraries, so go ahead and download and install [NPM](https://www.npmjs.com/get-npm).
2. Create an empty database :
- You'll need an empty Postgres database for storing your application data 
Postgres Url format : postgres://YourUserName:YourPassword@YourHostname:5432/YourDatabaseName

3. Install Server :
	- Open up a new terminal window and navigate to the server folder inside the Rocket directory and run the following command: "npm install"
	- Copy the .env.example file to .env using: "cp .env.example .env"
	- Open the .env file, enter your MongoDB URL in the POSTGRES_URL_TEST and the POSTGRES_URL field .
	- In the terminal, run "yarn dev" to start the development server : This will start the Rocket development server.
