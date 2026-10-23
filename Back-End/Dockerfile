# Etapa 1: compila o jar com Maven e JDK 25
FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app
# baixar as dependências antes de copiar o código aproveita o cache quando só o código muda
COPY pom.xml .
RUN mvn -q -B dependency:go-offline
COPY src ./src
# os testes rodam fora daqui (mvn test); a imagem só empacota
RUN mvn -q -B package -DskipTests

# Etapa 2: imagem final só com o JRE e o jar
FROM eclipse-temurin:25-jre
WORKDIR /app
RUN useradd --system --no-create-home app
USER app
COPY --from=build /app/target/*.jar app.jar
# o plano grátis do Render tem 512 MB de memória: o heap pode usar até 75% disso
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75"
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
