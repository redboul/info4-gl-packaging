# Workshop - Packaging and Containers

## prerequisite

Take a look at the [Readme file](./README.md) to have you machine correctly setup to do the workshop.

Steps to keep from docker guide

- `docker run -dp 80:80 docker/getting-started`

use the Spring boot app  
Look at the `Application.java` to see the Spring App  
Look at the `HelloController.java` to see what is expected

- execute `gradlew build`

look at the Dockerfile content
build the docker image

```
docker build -t info4-gl-java-app .
```

start docker container
```
docker run -dp 8080:8080 info4-gl-java-app
```

go to [localhost:8080](http://localhost:8080) to see the message previously saw in the `HelloController.java`

edit `HelloController.java` and change the message
rebuild the app (`gradlew build`)

go to [localhost:8080](http://localhost:8080) again and see the message has not changed yet

execute `docker logs -f <container-id>` to see the container output and follow it.

build once more the app
```
docker build -t info4-gl-java-app .
```

start the new container with the same previous command 
```
docker run -dp 8080:8080 info4-gl-java-app
```
see the error message with the container not being able to reuse the port binding

execute `docker ps` to list the existing running container
execute `docker stop <container-ids>` to stop running container

run `docker ps -a` to see all containers event the stopped ones

no need to delete them but the command would be `docker rm <container-ids>`


## Container File System

examples from the docker *Get Started* section

Start a _ubuntu_ container that will create a file named `/data.txt` with a random number between 1 and 10000.

```
docker run -d ubuntu bash -c "shuf -i 1-10000 -n 1 -o /data.txt && tail -f /dev/null"
```

use the docker `exec` command to execute a command on a running container

```
docker exec <container-id> cat /data.txt
```

you can run several ubuntu container without much restriction as they do not use any resources from the main system (your physical machine)  
each time, looking at the `data.txt` the value will be different.

### Persist the data

use the second version of the `HelloController.java` that reads the content of a file to Greet people.

build the app (`gradlew build`)
build a docker image `docker build -t info4-gl-java-app .`
run it `docker run -dp 8080:8080 info4-gl-java-app`
look at the log to ensure the app is up `docker logs -f <container-id>`

go to [localhost greet someone](http://localhost:8080?greet=someone) and change the `greet` http param to add new names.

each time your run a new container, the data.txt file is new and nothing is persisted.

#### create a volume

![volume in host and container](https://docs.docker.com/storage/images/types-of-mounts-volume.png)

use the following command to create a volume
```
docker volume create gl-docker
```

check the details of the volume with

```
docker volume inspect gl-docker
```

it will be used to store the data from containers when referenced

rebuild the whole app with 
```
gradle build
docker build -t info4-gl-java-app .
docker run -dp 8080:8080 -v test:/usr/libs/data info4-gl-java-app
```

you can even launch several container sharing the same volume and see that the data are shared. But you need to update the port to avoid sharing the same port between container which is not allowed.
```
docker run -dp 8080:8080 -v test:/usr/libs/data info4-gl-java-app
```

## communication between container

let's know use some real application and a database to store the data

We now have a REST app that uses a H2 database to store the data.

let's build and launch the app without docker:
```
gradlew build
java -jar build/libs/spring-boot-0.0.1-SNAPSHOT.jar
```

go to [guest list](http://localhost:8080/guest) to see the list of existing guest.
Obviously, there is not any...

use postman to add some
POST request to _http://localhost:8080/guest_
Header: *Content-Type: application/json*
Body:
```
{
    "firstName": "Joann",
    "lastName": "Sfar"
}
```

now you can reload the [guest list](http://localhost:8080/guest) or go directly to the [new guest](http://localhost:8080/guest/1) we have just created

H2 is a in memory database which goes fine there.
But let's say we have an external database launched in another container.


```
docker run -d -p 1521:1521 -p 81:81 -v data:/opt/h2-data -e H2_OPTIONS='-ifNotExists' --name=MyH2Instance oscarfonts/h2
```

For you application to be able to use, Spring needs to have the right settings to point to the database.  
but how can we make containers know each others?

you can use the settings of your local machine (using IP address) in the jdbc URL in the `application.properties`  
But that is not a long term solution and that breaks the replicability of the containers.

we need to use network for that

do the [docker tutorial for network](https://docs.docker.com/network/network-tutorial-standalone/)

update the app to have a network and use the container names in the URL and have the container talk to each other.

### the network command

```
docker network create info4-gl-network
docker run -d -p 1521:1521 -p 81:81 -v data:/opt/h2-data --network info4-gl-network  -e H2_OPTIONS='-ifNotExists' --name=MyH2Instance oscarfonts/h2
docker run -dp 8080:8080 --network info4-gl-network --name=rest-app xargs docker logs -ftest | xargs docker logs -f
```

## Adding a http Proxy

we will now use the static web app that is present inside the web folder.  
It contains a simple react demo app (from the create-react-app project with the typescript template).

I have only added the listing of the guest from the Rest App.

So now, we want to add simple http server that would serve the html files but also to be able to redirect the REST calls to the appropriate server/container (due to CORS restrictions a browser is limiting the JS request to the site it is onto).

### NGINX to the rescue

we will not configure a whole nginx server. We will only make work to 

```
docker run --rm --name some-nginx -v $(pwd)/build:/usr/share/nginx/html:ro -p 54321:80 -d nginx nginx-debug -g 'daemon off;'
docker run --name some-nginx -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf -v $(pwd)/build:/usr/share/nginx/html:ro -p 54321:80 -d --network info4-gl-network nginx nginx-debug -g 'daemon off;'
````

nginx will help 
