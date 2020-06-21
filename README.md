# DefHacks2020

## Running the server locally

This section is a brief summary of the Development section of [apprtc/README.md](https://github.com/keshavganapathy/Groove/blob/master/apprtc/README.md). See that page for more complete instructions.

First, install Google App Engine SDK for Puthon, Node.js, and Grunt. Then install the required dependencies using `npm install` and `pip install -r requirements.txt` from the `apprtc` directory.

Every time the source code is changed, you need to rebuild the App Engine Package using `grunt build`.

Start the AppRTC server by running

```
python path_to_sdk/dev_appserver.py apprtc/out/app_engine
```

from the project root.

Then you can access the app at [http://localhost:8080](http://localhost:8080) in your browser.

## Running the backend

Make `3d-posenet` the current working directory.  Then run the following commands,

```
yarn
yarn watch
```
