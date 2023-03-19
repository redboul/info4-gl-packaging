# Packaging and Docker management

## Use a Virtual Development environment

### Codespace

On the Code button of this repo, instead of copying the git URL, click on the Codespace Panel and create a virtual environment executed **from your browser**.

### Gitpod

Click on the following button to launch a Virtual Environment in Gitpod

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/redboul/info4-gl-packaging)

## Workshop

Open the [workshop document](./WORKSHOP.md)

## Do the workshop locally

### prerequisite

You need to download and install [Docker CE](https://docs.docker.com/engine/install/) and execute the following commands to avoid spending too much time downloading them during the session.

```
docker pull oscarfonts/h2
docker pull openjdk:11
docker pull nginx
```

Download and install a [Node.js LTS](https://nodejs.org/en/download/) version in order to build and execute the web server.  
Ideally, also install `yarn` as a package manager (which I used to build the project). But `npm` should be fine too.

#### Optionaly

Install [Gradle](https://gradle.org/install/) or [Maven](https://maven.apache.org/install.html).  
These are optional because this project includes wrapper for both commands (`gradlew` and `mavenw`) where both works correctly to generate the build.

I have used Gradle tools to execute this project and build paths are used accordingly.  
If you use Maven, you would need to change some command line and configuration to use the `target` folder instead of the `build` folder
