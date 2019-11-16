# Express React with Authentication

A detailed boilerplate which helps kick start your webpack

## Features

* Express
* Passport (JWT, Facebook, Instagram, Google authentication)
* Sequlize/Postgres DB with basic User model
* React 16
* Redux Store, API Middleware
* Router with authentication and logged in pages
* Material UI
* Webpack 4
* Babel 7
* Hot Module Replacement
* Nodemon, Sass, ESLint, etc.

## Usage

### Setup

Install the dependency modules

```sh
$ npm install
```

Ensure to update your config in config/default.json. You can have your machine only configuration in config/local.json

### Starting the service

Build the client

```sh
$ npm run webpack
```

Run the server

```sh
$ npm run start
```

### Misc commands

If you want to hot reload client, in a separate terminal window:

```sh
$ npm run webpack:watch
```

Migrate the DB

```sh
$ npm run migrate
```

Linting the code

```sh
$ npm run lint
```

Generate new secrets

```sh
$ npm run secret
```
