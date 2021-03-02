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

### Persist the todo data
By default, the todo app stores its data in a SQLite Database at `/etc/todos/todo.db`. If you’re not familiar with SQLite, no worries! It’s simply a relational database in which all of the data is stored in a single file. While this isn’t the best for large-scale applications, it works for small demos. We’ll talk about switching this to a different database engine later.

With the database being a single file, if we can persist that file on the host and make it available to the next container, it should be able to pick up where the last one left off. By creating a volume and attaching (often called “mounting”) it to the directory the data is stored in, we can persist the data. As our container writes to the `todo.db` file, it will be persisted to the host in the volume.

As mentioned, we are going to use a named volume. Think of a named volume as simply a bucket of data. Docker maintains the physical location on the disk and you only need to remember the name of the volume. Every time you use the volume, Docker will make sure the correct data is provided.

Create a volume by using the docker volume create command.
```
docker volume create todo-db
```

let's use the `getting-started` app to persist some database files
1. stop the existing container and delete it.
2. start a new container using the just created *volume* 
  ```
  docker run -dp 3000:3000 -v todo-db:/etc/todos docker/getting-started
  ```
