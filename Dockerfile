# 1. Usar Maven y Java 17 para compilar el proyecto (Versión actualizada)
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# 2. Usar una imagen más ligera de Java para encenderlo
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/demo-0.0.1-SNAPSHOT.jar app.jar

# 3. Exponer el puerto y arrancar "Elchamospotify"
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]