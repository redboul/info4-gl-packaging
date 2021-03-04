# Docker management

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
