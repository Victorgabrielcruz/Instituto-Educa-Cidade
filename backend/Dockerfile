FROM maven:3.9.6-eclipse-temurin-21

# Aceita a licença do mscorefonts e instala Arial
RUN apt-get update && \
    apt-get install -y fontconfig && \
    echo "ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true" | debconf-set-selections && \
    apt-get install -y ttf-mscorefonts-installer && \
    fc-cache -f -v

ENV PROJECT_HOME /usr/src/educacidadesapp
ENV JAR_NAME educacidadesapp.jar

# Cria diretório de trabalho
RUN mkdir -p $PROJECT_HOME
WORKDIR $PROJECT_HOME

# Copia o código-fonte
COPY . .

# Compila a aplicação
RUN mvn clean package -DskipTests

# Move o JAR gerado para a raiz do diretório do projeto
RUN mv $PROJECT_HOME/target/$JAR_NAME $PROJECT_HOME/

# Executa a aplicação
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=dev", "educacidadesapp.jar"]
