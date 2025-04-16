pipeline {
    agent any

    environment {
        IMAGE_NAME = 'ademselmani/projetpi'
        DOCKER_USERNAME = 'ademselmani'
        DOCKER_PASSWORD = 'adem94038666'
        COMPOSE_FILE = 'docker-compose.yml'
    }

    tools {
        jdk 'JAVA_HOME'
        maven 'M2_HOME'
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'ademselmani-4Twin1-G6', url: 'https://github.com/ademselmani/4TWIN1-G6-Sukunami.git'
            }
        }

        stage('Compile') {
            steps {
                sh 'mvn clean compile'
            }
        }

        
        stage('Run Unit Tests') {
            steps {
                sh 'mvn test'
            }
        }


        stage('Package JAR') {
            steps {
                sh 'mvn package -DskipTests'
            }
        }

        stage('MVN SONARQUBE') {
            steps {
                sh "mvn sonar:sonar -Dsonar.login=squ_a546fefc5f50e9f80714f82c88e69e723519390a -Dmaven.test.skip=true"
            }
        }

        stage('Deploy to Nexus') {
            steps {
                sh 'mvn deploy -Dmaven.test.skip=true'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                sh '''
                    echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
                    docker push $IMAGE_NAME
                '''
            }
        }

       

    post {
        success {
            echo '✅ Build and Deployment successful!'
        }
        failure {
            echo '❌ Build or Deployment failed!'
        }
    }
}
