# DefHacks2020

## Running the server locally

This section is a brief summary of the Development section of [https://github.com/webrtc/apprtc](https://github.com/webrtc/apprtc). See that page for more complete instructions.

First, install Google App Engine SDK for Puthon, Node.js, and Grunt. Then install the required dependencies using `npm install` and `pip install -r requirements.txt` from project root.

Every time the source code is changed, you need to rebuild the App Engine Package using `grunt build`.

Start the AppRTC server by running

```
python path_to_sdk/dev_appserver.py ./out/app_engine
```

Then you can access the app at [http://localhost:8080](http://localhost:8080) in your browser.
