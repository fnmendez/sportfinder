# frandz api

## Table Of Contents

- [Development](#development)
- [Environment variables](#environment-variables)
- [Api usage](#api-usage)
  - [Accounts](#accounts)
    - [Sign up](#sign-up)
    - [Login](#login)
  - [Sports](#sports)
    - [Get sports](#get-sports)
  - [Clubs](#clubs)
    - [Get clubs](#get-sports)
  - [Teams](#teams)
    - [Get teams](#get-teams)
    - [See a team](#see-a-team)
    - [Create team](#create-teams)
    - [Invite to team](#invite-to-teams)
    - [Join team](#join-team)
  - [Matches](#matches)
    - [Get open matches](#get-open-matches)
    - [Create match](#create-match)
    - [Join match](#join-match)
- [Contributors](#contributors)

## Api usage

### Accounts

#### Sign up

- Route: `POST` `/api/signup`

- Headers:
  - Content-Type: `application/json`

- Example Body:

  ```javascript
  {
    "username": "frank",
    "name": "Franco",
    "surname": "Méndez",
    "mail": "fnmendez@uc.cl",
    "address": "Louis Pasteur 5418, Vitacura"
    "password": "123456"
  }
  ```

- Success Response:

  - Status: 201
  - Content:

    ```javascript
    { "key": "frandz-token" }
    ```

- Error Response:

  - Code: 406
  - Content:

    ```javascript
    { "message": "error-message" }
    ```

***

#### Login

- Route: `POST` `/api/login`

- Headers:
  - Content-Type: `application/json`

- Example Body:

  ```javascript
  {
    "mail": "fnmendez@uc.cl",
    "password": "123456"
  }
  ```

- Success Response:

  - Status: 201
  - Content:

    ```javascript
    { "key": "frandz-token" }
    ```

- Error Response:

  - Code: 403
  - Content:

    ```javascript
    { "message": "Invalid credentials." }
    ```

***

### Sports

#### Get sports

- Route: `GET` `/api/sports`

- Headers:
  - Content-Type: `application/json`
  - Authorization: `frandz-token`

- Success Response:

  - Status: 200
  - Example Content:

    ```javascript
    {
      "sports":
      [
        {
            "name": 'Futsal',
            "maxPlayers": 12,
        },
        {
            "name": 'Tenis',
            "maxPlayers": 2,
        }
      ]
    }
    ```

- Error Response:

  &rarr; If the user isn't authenticated

  - Code: 403
  - Content:

    ```javascript
    { message: 'The information is private.' }
    ```

  &rarr; Other error

  - Code: 503
  - Content:

    ```javascript
    { "message": "Couldn't resolve request." }
    ```

***

### Clubs

#### Get clubs

- Route: `GET` `/api/clubs`

- Headers:
  - Content-Type: `application/json`
  - Authorization: `frandz-token`

- Success Response:

  - Status: 200
  - Example Content:

    ```javascript
    {
      "clubs":
      [
        {
            "name": 'Lo cañas',
            "sports":
            [
              {
                "name": "Futbolito",
                "price": 32000,
                "unitTime": "1 hora"
              },
              {
                "name": "Futsal",
                "price": 24000,
                "unitTime": "1 hora"
              },
              {
                "name": "Squash",
                "price": 12000,
                "unitTime": "1 hora"
              }
            ]
        },
        {
            "name": 'Ciudad Deportiva Ivan Zamorano',
            "sports":
            [
              {
                "name": "Fútbol",
                "price": 48000,
                "unitTime": "1 hora"
              },
              {
                "name": "Futbolito",
                "price": 28000,
                "unitTime": "1 hora"
              },
            ]
        },
      ]
    }
    ```

- Error Response:

  &rarr; If the user isn't authenticated

  - Code: 403
  - Content:

    ```javascript
    { message: 'The information is private.' }
    ```

  &rarr; Other error

  - Code: 503
  - Content:

    ```javascript
    { "message": "Couldn't resolve request." }
    ```

***

### Teams

#### Get teams

- Route: `GET` `/api/teams`

- Headers:
  - Content-Type: `application/json`
  - Authorization: `frandz-token`

- Success Response:

  - Status: 200
  - Example Content:

    ```javascript
    {
      "teams":
      [
        {
            "id": 1,
            "name": 'Dream Team',
            "members": 12,
        },
        {
            "id": 2,
            "name": 'Barcelona',
            "members": 22,
        }
      ]
    }
    ```

- Error Response:

  &rarr; If the user isn't authenticated

  - Code: 403
  - Content:

    ```javascript
    { message: 'The information is private.' }
    ```

  &rarr; Other error

  - Code: 503
  - Content:

    ```javascript
    { "message": "Couldn't resolve request." }
    ```

***

#### See a team

- Route: `GET` `/api/teams/:id`

- Headers:
  - Content-Type: `application/json`
  - Authorization: `frandz-token`

- Success Response:

  - Status: 200
  - Example Content:

    ```javascript
    {
      "team":
        {
          "name": 'Dream Team',
          "members":
            [
              {
                "name": "Franco Mendez"
              },
              {
                "name": "Andrés Mardones"
              }
            ]
        }
    }
    ```

- Error Response:

  &rarr; If the user isn't authenticated

  - Code: 403
  - Content:

    ```javascript
    { message: 'The information is private.' }
    ```

  &rarr; Other error

  - Code: 503
  - Content:

    ```javascript
    { "message": "Couldn't resolve request." }
    ```

***

### Matches

#### Get open matches

- Route: `GET` `/api/matches`

#### Create match

- Route: `POST` `/api/matches`

#### Join match

- Route: `POST` `/api/matches/:id`

***

## Contributors:

- [@fnmendez](https://github.com/fnmendez)
- [@agmardones](https://github.com/agmardones)
