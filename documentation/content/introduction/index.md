# Prici

Prici is an open-source project to manage plans and pricing for any SaaS application.
You can use Docker's standalone service and run it locally or on your machine.

## The problem
Hint: not us developers.

We, developers, want to develop features and applications.
Then those business people come and ask to create a pricing page, but after a while - it's not enough
They change the limits, the plans, the features allowed to each plan.

And they keep doing it even when we have thousands of features, and only because they want to earn something called "money" and to have something called "prosperity". weird.

We just wanted a boolean answer to a simple question: "is this feature allowed for this account?".

## The solution
Prici.

Buy really. Prici will handle the actual state of the plan for any account, even if it has multiple plans, even if the plans are "complicated", and will answer a boolean answer to the question:

"is this feature allowed for this account?".

It will also do a lot more, but our main context is to help the developers to develop, instead of dealing with the users to pay (there are trillion other services for that).

-------
## Getting started

Create a `.env` file with the following content:
```dotenv
JWT_SECRET=something-difficult-to-break
# Enable /api/admin route for admin interface
ADMIN_UI=true
```

Run it locally or wherever:
```shell
$ docker run -p 9000:9000 --env-file=.env ghcr.io/prici-io/prici:main
```

That's it. Now **prici** runs on port 9000.
