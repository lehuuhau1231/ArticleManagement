FROM maven:3-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
<<<<<<< Updated upstream
COPY --from=build /app/target/DrComputer-0.0.1-SNAPSHOT.war drcomputer.war
=======
COPY --from=build /app/target/article-0.0.1-SNAPSHOT.jar app.jar
>>>>>>> Stashed changes
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
