# Use lightweight Java 17 runtime
FROM eclipse-temurin:17-jre

# Set working directory inside container
WORKDIR /app

# Copy built jar into container
COPY target/snake-ladder-1.0.0.jar app.jar

# Expose application port (if using Spring Boot)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
