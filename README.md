# MAC Custom Status Checker

This will be used for the Monash Association of Coding (MAC) Open Source project where only members of MAC are able to send PRs to the repository. Using this status checker, we can ensure that the user sending a PR is a member of MAC!

---

## Getting Started

### Set up environment variables

_Suggested:_ Create a `.env` file with the following values.

| ENV Variable | Value                                                      |
| ------------ | ---------------------------------------------------------- |
| PORT         | Port you would like to host the server                     |
| SECRET_TOKEN | A secret token that is stored on server-side and on Github |
| ACCESS_TOKEN | Your personal access token (See below on setting this up)  |

#### SECRET_TOKEN

Highly recommend you generate the secret token by running the following on command line:

```bash
node -e "require('crypto').randomBytes(48, function(ex, buf) { console.log(buf.toString('hex')) });"
```

The output of this should be your generated token!

#### ACCESS_TOKEN

See [here](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) for steps on doing this on Github.

**NOTE: The token should only need to have `repo:status` checked.**

### Installation

Make sure you have node.js and mongoDB installed.

Install dependencies using

```bash
npm install
```

I recommend using `yarn` to install dependencies:

```bash
yarn install
```

### Running the webhook

#### Development

To start the server:

```bash
npm run start
```

##### Hosting the server locally

I suggest setting up ngrok. This library allows you you to host your localhost node server and expose it publically.

Starting ngrok:

```bash
ngrok http 5000
```

Note: _Port above is dependant on the port you set. 5000 is the default port for the server_

#### Production

_To be done_

### Adding the webhook

Go to the respository that you want to add the webhook in.

Go to Settings > Webhooks > Add webhook.

Set Payload URL with the link to your node server.

Set Secret to the value of `SECRET_TOKEN`

Select _Let me select individual events_ then select _Pull requests_.

Click _Add webhook_

Everytime the repository receives a pull request, your server should receive a POST request!

## REST Endpoints

| URL             | Method | Body                                                   | Description                              |
| --------------- | ------ | ------------------------------------------------------ | ---------------------------------------- |
| `/member/add`   | POST   | `{ name: <string>, email: <string>, github: <string>}` | Add a new member to the databas          |
| `/member/valid` | POST   | `{ github: <string>}`                                  | Check if a github user is a valid member |