FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/transaction-service-1.0.0.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
