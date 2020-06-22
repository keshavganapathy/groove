# Groove

Groove is a novel platform implementing 3D vision that allows high quality fitness training to be accessible to all during the COVID-19 pandemic, hosted on Google Cloud. This project is a submission to DefHacks 2020 virtual, an international hackathon. Teammates: Keshav Ganapathy, Adam Goldstein, David Aylaian, Peter Ganunis, and Siddhant Shenoy. This project recieve 2nd Place Health Hack at DefHacks 2020 virutal.

## Running the server locally

This section is a brief summary of the Development section of [apprtc/README.md](https://github.com/keshavganapathy/Groove/blob/master/apprtc/README.md). Please read that page for more detailed instructions.

First, install Google App Engine SDK for Puthon, Node.js, and Grunt. Then install the required dependencies using `npm install` and `pip install -r requirements.txt` from the `apprtc` directory.

Every time the source code is changed, you need to rebuild the App Engine Package by running `grunt build` from the `apprtc` directory. Then copy the files inside the `copyTheseFilesIntoTheJSFolderInOut-app_engine` directory to to `out/app_engine/js/`.

Start the AppRTC server by running

```sh
python path_to_sdk/dev_appserver.py path_to_apprtc/out/app_engine
```

You can then access the app by visiting [http://localhost:8080](http://localhost:8080) in your browser.

## Deploying the server to Google Cloud

Instructions are located in [apprtc/README.md](https://github.com/keshavganapathy/Groove/blob/master/apprtc/README.md).

## Running the backend

Make `3d-posenet` the current working directory.  Then run the following commands,

```sh
yarn
yarn watch
```
