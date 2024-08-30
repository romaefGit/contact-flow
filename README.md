# Contact Crud Roma

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.2. The application allows you to manage contacts by adding, editing, and deleting them. Each contact can store multiple phone numbers along with other details like personal email and notes.

- It use SCSS and BEM Metodology for resusable components and easy to edit, I didn't use any Framework of css to show my skills without them.
- It use components with standalone, there are no modules as Angular 17 update.
- It use lazy loading for routes.
- It use RXJS for services and components communication.

Special thanks go to:

- [Romario Estrada](https://romaefportfolio.web.app/) for his nice develop.

## Table of Contents

- [Installation](#installation)
- [Run app](#run-app)
- [Run server](#run-server)
- [Code scaffolding](#code-scaffolding)

## Installation

Clone the repo:

- `git clone https://github.com/romaefGit/contact-flow.git`

Execute `npm install` on the root of the project using Node 18.

## Run App

Run `ng serve` or `npm start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Run Server

Run `npm run server` for a dev server. Navigate to `http://localhost:3000/`. You will be able to see the services `contacts` and `types`

```bash
Endpoints:

http://localhost:3000/users
http://localhost:3000/types
```

## Use app

When you run the project and the server, you can access:

```bash

http://localhost:4200/auth/register ----- To register a new user account
http://localhost:4200/auth/login ----- To login into the tool of contacts

```

## Work in progress

You can see the demo as a work in progress, the server json doesn't work, so you could not add anything by now:

- [contact-crud-roma](https://contact-crud-roma.web.app/contacts) and if you liked, give me a star on the [Respository](https://github.com/romaefGit/contact-flow.git)

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Browser Support

At present, we officially aim to support the last two versions of the following browsers:

| Chrome | Firefox | Edge | Opera |
| ------ | ------- | ---- | ----- |

## Licensing

Licensed under [MIT](https://choosealicense.com/licenses/mit/)
