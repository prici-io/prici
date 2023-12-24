# Prici

Prici is an open-source project to manage plans and pricing for any SaaS application.
You can use Docker's standalone service and run it locally or on your machine.

-------
## Getting started

Create a `.env` file with the following content:
```dotenv
JWT_SECRET=something-difficult-to-break
```

Run it locally or wherever:
```shell
$ docker run -p 9000:9000 --env-file=.env ghcr.io/prici-io/prici:main
```

That's it. Now **prici** runs on port 9000.

</br></br>
-------
## Use a custom database

If you don't mention any database connection, it will use local JSON files.
you can keep them for persistence by adding a volume to the container, e.g.:

```sh
$ docker run -p 9000:9000 --env-file=.env -v ./db:/app/apps/api/db ghcr.io/prici-io/prici:main
```
</br>

### Postgres

Add an environment variable with the Postgres connection string.

```sh
$ docker run -p 9000:9000 --env POSTGRES_URL=YOUR-DB-CONNECTION-STRING ghcr.io/prici-io/prici:main
```
</br>

### MongoDB

Add an environment variable with MongoDB URL.
Just so you know, you can add the DB name manually if your connection string does not include the DB name.

```sh
$ docker run -p 9000:9000 --env MONGODB_URL=YOUR-MONGODB_URL --env MONGODB_DB_NAME=YOUR_DB_NAME_OPTIONAL ghcr.io/prici-io/prici:main
```
</br></br>
-------
## Node SDK

Just install the SDK:
```sh
$ npm install @prici/sdk
```

