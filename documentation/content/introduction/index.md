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
