# 1. Usar Maven y Java 21 para compilar el proyecto
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# 2. Usar una imagen más ligera de Java 21 para encenderlo
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/demo-0.0.1-SNAPSHOT.jar app.jar

# 3. Exponer el puerto y arrancar "Elchamospotify"
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]