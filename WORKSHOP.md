# Workshop - Packaging and Containers

## Prerequisite

Take a look at the [Readme file](./README.md) to have your machine correctly setup to do the workshop.

## Build an application

Open the *rest-app* project into your favorite IDE (Eclipse/Sublime/VSCode/...) with a minimal Java text Formatting.

Look at the `Application.java` to see the Spring App.  
A very simple HelloWorld app is in the `HelloController` class.

You can simply build the current application and start it to have a working web application:

```
./gradlew build
java -jar build/libs/spring-boot-0.0.1-SNAPSHOT.jar
```

Go to [localhost:8080/hello](http://localhost:8080/hello) to see the message previously saw in the `HelloController.java`

Look at the `HelloController.java` to see what is expected.  
Nothing special, I agree.

## Simple introduction to docker

Launch the following simple command to ensure docker is correctly installed on your machine.

```
docker run -dp 80:80 docker/getting-started
```

If that's ok, we can have a look at the Dockerfile.

Now, build the docker image with the following command.

```
docker build -t info4-gl-java-app .
```

We have built our first image.  
Start it with the `run` command from `docker` cli where the `p` option allows to map a port of the container to the actual machine.  
The last parameter being the docker image we want to run.

```
docker run -dp 8080:8080 info4-gl-java-app
```

The container id is displayed as an output of the `docker run` command.

Go to [localhost:8080](http://localhost:8080) to see the message previously saw in the `HelloController.java`

Now, edit `HelloController.java` and change the message and rebuild the app (`gradlew build`).  
Go to [localhost:8080](http://localhost:8080) again and see the message has not changed yet.

Execute `docker logs -f <container-id>` to see the container output and follow it.

Build once more the app.

```
docker build -t info4-gl-java-app .
```

Start the new container with the same previous command.

```
docker run -dp 8080:8080 info4-gl-java-app
```
 
See the error message with the container not being able to reuse the port binding.

Execute `docker ps` to list the existing running container.  
Execute `docker stop <container-ids>` to stop running container.  

Run `docker ps -a` to see all containers even the stopped ones

No need to delete them but the command would be `docker rm <container-ids>`


## Container File System

Examples taken from the [Docker *Get Started*](https://docs.docker.com/get-started/05_persisting_data/) section.

Start an _ubuntu_ container that will create a file named `/data.txt` with a random number between 1 and 10000.

```
docker run -d ubuntu bash -c "shuf -i 1-10000 -n 1 -o /data.txt && tail -f /dev/null"
```

Use the docker `exec` command to execute a command on a running container

```
docker exec <container-id> cat /data.txt
```

You can run several ubuntu container without much restriction as they do not use any resources from the main system (your physical machine).  
Each time, looking at the `data.txt` the value will be different.

### Persist the data

Use the `GreetingsController.java` that reads the content of a file to Greet people.

Create a file in the *data* folder named *data.txt*.
Run the app from a docker container:  `docker run -dp 8080:8080 info4-gl-java-app`  
Look at the log to ensure the app is up `docker logs -f <container-id>`

Go to [localhost greet someone](http://localhost:8080/greetings?greet=someone).

An error is displayed. Take a look at the logs of the container.

Open the `Dockerfile` and uncomment the line 4 and 5.  
Rebuild another image.

Stop the former container that uses the port **8080** and start a container of the freshly built `info4-gl-java-app` image.

Go to [localhost greet someone](http://localhost:8080/greetings?greet=someone) and change the `greet` http param to add new names.

Stop the container and create a new one.

Each time your run a new container, the data.txt file is new and nothing is persisted.

Comment once more the line 4 and 5 of the `Dockerfile` and move to next section.

#### Mount a local path

Currently, the local `data/data.txt` file is not used by the container.  
That is because the container have no visibility whatsoever of the parent machine as long as you don't share anything between them.

The `-v local_absolute_path:container_absolute_path` option allows you to play with so called **volumes** with the container.

Ensure the image of the `info4-gl-java-app` is up-to-date (run `docker build -t info4-gl-java-app .`) and add the volume option to the already famous command:

```
docker run -dp 8080:8080 -v "$(pwd)"/data:/usr/libs/data info4-gl-java-app
```

#### Create a volume

![volume in host and container](https://docs.docker.com/storage/images/types-of-mounts-volume.png)

You can create persistent storage not directly related to your local storage using **docker volumes**.

Use the following command to create a volume

```
docker volume create gl-docker
```

Check the details of the volume with

```
docker volume inspect gl-docker
```

It will be used to store the data from containers when referenced.

Comment out the lines 4, 5 and 6 in the *Dockerfile*.  
Rebuild the whole app with 

```
./gradlew build
docker build -t info4-gl-java-app .
docker run -dp 8080:8080 -v gl-docker:/usr/libs/data info4-gl-java-app
```

You can even launch several container sharing the same volume and see that the data are shared. But you need to update the port to avoid sharing the same port between container which is not allowed.
```
docker run -dp 8081:8080 -v gl-docker:/usr/libs/data info4-gl-java-app
```

## Communication between container

Let's know use some real application and a database to store the data.  
We now have a REST app that uses a H2 database to store the data.

Comment out the lines from the files *build.gradle* or *pom.xml* to add some new dependenciesa and also in *Guest.java* and *GuestRepository.java* to enable the JPA Repository framework.

Let's build and launch the app without docker:

```
./gradlew build
java -jar build/libs/spring-boot-0.0.1-SNAPSHOT.jar
```

Go to [guest list](http://localhost:8080/guest) to see the list of existing guest.
Obviously, there is not any...

### Add some data with POSTMAN

POST request to _http://localhost:8080/guest_  
Header: *Content-Type: application/json*  
Body:
```
{
    "firstName": "Joann",
    "lastName": "Sfar"
}
```

### Add some Data with `curl`

```
curl -X POST  -H "Content-Type: application/json" -d '{"firstName": "Joann", "lastName": "Sfar"}' http://localhost:8080/guest
```

Now you can reload the [guest list](http://localhost:8080/guest) or go directly to the [new guest](http://localhost:8080/guest/1) we have just created.

H2 is the default database launched by Spring Boot when there is no configuration present. It is a in memory database which goes fine there but is hosted inside the Java memory.
But let's say we have an external database launched in another container.

For your application to be able to use it, Spring needs to have the right settings to point to the database.  
but how can we make containers know each others?

You can use the settings of your local machine (using IP address) in the jdbc URL in the `application.properties`  
But that is not a long term solution and that breaks the replicability of the containers.

We need to use **docker network** for that.

**Optional**: Do the [docker tutorial for network - *Use the default bridge network*](https://docs.docker.com/network/network-tutorial-standalone/#use-the-default-bridge-network)

After this, update the app to have a network and use the container names in the URL and have the container talk to each other.

**Tip**: uncomment the content of `application.properties` and don't forget to rebuild the app and the docker image!

### The network command

```
docker network create info4-gl-network
docker run -d -p 1521:1521 -p 81:81 -v data:/opt/h2-data --network info4-gl-network  -e H2_OPTIONS='-ifNotExists' --name=MyH2Instance oscarfonts/h2
docker run -dp 8080:8080 --network info4-gl-network --name=rest-app info4-gl-java-app  | xargs docker logs -f
```

## Adding a http Proxy

We will now use the static web app that is present inside the web folder.  
It contains a simple react demo app (from the [create-react-app](https://github.com/facebook/create-react-app) project with the typescript template).

I have only added the listing of the guest from the Rest App.

So now, we want to add simple http server that would serve the html files but also to be able to redirect the REST calls to the appropriate server/container (due to CORS restrictions a browser is limiting the JS request to the site it is onto).

### NGINX to the rescue

Open a new terminal window and go to the `web` directory.

We will not configure a whole nginx server. We will only make it work to have the static files being served and the calls to the `/guest/` folder being redirected to the *rest-app* container.

```
docker run --rm --name nginx -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf -v $(pwd)/build:/usr/share/nginx/html:ro -p 54321:80 -d --network info4-gl-network nginx nginx-debug -g 'daemon off;'
````

This way, we can have a separate container that do the work we're expecting it to do.

But what if we want to do an image about it and not being forced to configure the path to the static files or the configuration file?

We can do it simply using the given same files (_nginx.conf_ and the _build_ folder) and using a Dockerfile from an nginx image and the `COPY` command.

#### Troubleshoot the container

Something that can be a help later: use the following command line to troubleshoot the containers

```
docker exec -t -i nginx /bin/bash
```

It opens a `bash` terminal on the container. You are, however, dependent of the tools that are installed on the container.  
For instance, on the `nginx` image, neither *vi* nor *nano* are available if you want to edit a file.

#### start the nginx container with embedded files

To start the container when you have build the right image (`docker build -t proxy-nginx .`), you can use the following command (where there is no volume mounting parameters):

```
docker run --rm --name nginx  -p 54321:80 -d --network info4-gl-network proxy-nginx nginx-debug -g 'daemon off;'  | xargs docker logs -f
```

Note that the `--rm` option removes the container (and its logs) when the container is stopped or has a failure.

## Docker Compose

Ok, now we have a running app, but it needs several manual steps to make it work:
- create a network
- create volumes
- create images
- create container with network, port and volume options

This is kind of a PITA to do all this for our app or when we want to deploy the app on a server...

The docker team had the same reaction and created the `docker-compose` tool to help us.

Using a simple YAML file, all the necessary stuff are created and loaded in an isolated environment.

The existing *docker-compose.yml* file allows you to build and launch 2 containers using the following command:

```
docker-compose up --build
```

And Job's done!

Try to add the necessary container to build the *web* container and have it linked to the *rest-app*.

