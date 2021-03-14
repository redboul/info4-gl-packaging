FROM openjdk:11
COPY build/libs /usr/libs
WORKDIR /usr/libs
# RUN mkdir /usr/libs/data
# RUN ["/bin/bash", "-c", "echo Didier  > /usr/libs/data/data.txt"]
# VOLUME /usr/libs/data
CMD ["java", "-jar", "spring-boot-0.0.1-SNAPSHOT.jar"]
