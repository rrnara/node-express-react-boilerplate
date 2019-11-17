# Express React with Authentication

A detailed boilerplate which helps kick start your website. The service has an User model with support for password or OAuth flow, REST APIs to do that, SPA client ability to perform various auth flows.

## Features

* Express <img src="https://camo.githubusercontent.com/fc61dcbdb7a6e49d3adecc12194b24ab20dfa25b/68747470733a2f2f692e636c6f756475702e636f6d2f7a6659366c4c376546612d3330303078333030302e706e67" height="24">
* Passport (JWT, Facebook, Instagram, Google authentication) <img src="http://cdn.auth0.com/img/passport-banner-github.png" height="24">
* Sequlize/Postgres DB with basic User model <img src="https://cdn.worldvectorlogo.com/logos/sequelize.svg" height="24">
* Winston/Morgan for logging
* Mailgun <img src="https://camo.githubusercontent.com/a7b368cab293892c59fc278fa5cebe4f8ddbe1a8/68747470733a2f2f7261772e6769746875622e636f6d2f6d61696c67756e2f6d656469612f6d61737465722f4d61696c67756e5f5072696d6172792e706e67" height="24">
* React 16 <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" height="24">
* Redux Store, API Middleware <img src="https://raw.githubusercontent.com/reduxjs/redux/master/logo/logo-title-dark.png" height="24">
* Router with authentication and logged in pages
* Material UI <img src="https://material-ui.com/static/images/material-ui-logo.svg" height="24">
* Webpack 4 <img src="https://raw.githubusercontent.com/webpack/media/master/logo/logo-on-white-bg.jpg" height="24">
* Babel 7 <img src="https://raw.githubusercontent.com/babel/logo/master/babel.png" height="24">
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

#### Build the client

```sh
$ npm run webpack
```

#### Run the server

```sh
$ npm run start
```

### Misc commands

#### If you want to hot reload client, in a separate terminal window:

```sh
$ npm run webpack:watch
```

#### Migrate the DB

```sh
$ npm run migrate
```
Look at sequelize-cli to run other commands like generating seeds.

#### Linting the code

```sh
$ npm run lint
```

#### Generate new secrets

```sh
$ npm run secret
```

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Copyright (c) 2019 rrnara

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

