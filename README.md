# Contacts App

A web-app to to store contacts. [Online Demo](https://contacts-app-challenge.herokuapp.com)

## Architecture

This app is comprised of a front-end server-side rendered single-page application built with [Vue.js](https://github.com/vuejs/vue) and a REST API written in [Node.js](https://github.com/nodejs/node), using [Hapi.js](https://github.com/hapijs/hapi) as framework and [PostgreSQL](http://www.postgresql.org/) as database.

### Front-end

The front-end, built with Vue.js, is component based. The server-side rendering was derived from [vinicius0026/hapi-vue-ssr](https://github.com/vinicius0026/hapi-vue-ssr). Although this is a little overkill for this app, server-side rendering is crucial for reducing time-to-content in single-page applications.

The entry points to server and browser environments are, respectively, `app/entry-client.js` and `app/entry-server.js`. The root app is setup on `app/App.vue`.

Even though there is only the main route in the app, [vue-router](https://github.com/vuejs/vue-router) is used to load the data when the app is rendered on server-side. The `HomeView.vue` component, under `app/pages` directory, is mounted on the main route directory.

The remaining components are located under `app/components`.

[vuex](https://github.com/vuejs/vuex) is used to manage application state. As this app is rather simple, `vuex` modules where not used so all global state related code is under `app/store/index.js`.

All requests to the API are done via service singletons, that lie in `app/services`. As there is only one resource to this app, only one service was created, `contacts.js`.

[Stylus](http://stylus-lang.com/) is used as CSS Preprocessor.

The app is bundled with [webpack](https://webpack.github.io/). All `webpack` related configuration is under `build` folder.

[Vuetify](https://vuetifyjs.com/) Material Component Framework was used for most app's layout. The design was inspired by macOs Contacts app and on [Google Contacts](https://contacts.google.com/) app.

### Back-end

The back-end is a REST API built in Node.js with Hapi.js and PostgreSQL.

Code is organized using Hapi.js plugins. General purpose plugins are located under `server/plugins` and API plugins are under `server/api`.

For each resource on the API there is a folder under `server/api` containing the following files:

- `index.js` Plugin declaration file. The routes are registered on this file.
- `handlers.js` Handlers file. All handlers for the routes declared on `index.js` are located on this file
- `model.js` The resource model. All database operations go through this file
- `schema.js` A schema declaration file, using [Joi](https://github.com/hapijs/joi), used on route validation

[Objection](http://vincit.github.io/objection.js/) ORM is used for simplifying database queries. All model classes extend `server/util/BaseModel.js` class, which in turn extends the Objection Model class, adding some added niceties such as automatic conversion between camelCase and snake_case and automatic timestamping operations like insert and update.

[knex](http://knexjs.org/) is the query builder used by Objection and it is also used to run database migrations. Migration files are stored under `migrations` directory on the project root.

Other relevant modules are:

- [Boom](https://github.com/hapijs/boom) for error handling
- [Confidence](https://github.com/hapijs/confidence) for storing environment-based configuration. Configuration lies in `server/config.js` file.
- [Glue](https://github.com/hapijs/glue) for composing all server plugins

### API Documentation

API documentation is automatically generated based on routes declaration. [hapi-swagger](https://github.com/glennjones/hapi-swagger) is used to achieve this.

The docs are available online [here](https://contacts-app-challenge.herokuapp.com/documentation)

## Running

Make sure you have Node.js (version >= 8.9) installed and PostgreSQL installed and running.

- Clone this repo.

- Create two databases, without password:

  - `contacts_app_test` for testing environment
  - `contacts_app_dev` for development

- Install dependencies:

```
npm install
```

- Run migrations

```
npm run knex migrate:latest
```

- Start app in development mode:

```
npm run dev
```

## Testing

Tests are included for all the API endpoints. Make sure you have setup the test database and run:

```
npm run test
```

## Deploy

The online demo is deployed to [heroku](https://heroku.com). You can follow their [documentation](https://devcenter.heroku.com/categories/deployment) to deploy another version of this app.

## Analyzing bundle

Bundle can be analyzed using the command `npm run analyze`. This will build the application in production mode and will create an interactive treemap visualization of the contents of the bundles. [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) is used for generating the analysis. This can be useful for optimizing bundle size.

## Code style

[Standard](https://standardjs.com/) style is used on javascript files.

For Vue.js files, the official [Vue Style Guide](https://vuejs.org/v2/style-guide/) is followed to the maximum extent. The rules are enforced via [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue) module.

Code style can be verified by running:

```
npm run lint
```

## Contributing

Feel free to open PRs to this module. Make sure you adhere to code style and that you add/correct API tests, if needed.

## LICENSE

This app is MIT Licensed. See the [LICENSE](LICENSE) file for details.
