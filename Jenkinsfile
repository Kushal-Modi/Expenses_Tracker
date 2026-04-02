pipeline {
    agent any

    environment {
        DOCKER_HUB = "kushalmodi220105"
        IMAGE_BACKEND = "${DOCKER_HUB}/expense-backend:latest"
        IMAGE_FRONTEND = "${DOCKER_HUB}/expense-frontend:latest"
    }

    stages {

        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/Kushal-Modi/Expenses_Tracker.git'
            }
        }

        stage('Build Backend') {
            steps {
                sh 'cd backend && mvn clean package'
            }
        }

        stage('Build Frontend') {
            steps {
                sh '''
                cd frontend
                npm install
                npm run build
                '''
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                docker build -t $IMAGE_BACKEND ./backend
                docker build -t $IMAGE_FRONTEND ./frontend
                '''
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-cred',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    '''
                }
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                docker push $IMAGE_BACKEND
                docker push $IMAGE_FRONTEND
                '''
            }
        }

      stage('Deploy to Kubernetes') {
    steps {
        withCredentials([usernamePassword(
            credentialsId: 'aws-cred',
            usernameVariable: 'AWS_ACCESS_KEY_ID',
            passwordVariable: 'AWS_SECRET_ACCESS_KEY'
        )]) {
            sh '''
            export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
            export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
            export AWS_DEFAULT_REGION=us-east-1

            aws eks update-kubeconfig \
            --region us-east-1 \
            --name expense-cluster

            kubectl apply -f k8s/ --validate=false
            '''
        }
    }
}

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                kubectl apply -f k8s/ --validate=false
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline executed successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
