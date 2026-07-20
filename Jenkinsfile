pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Build and run e2e with coverage') {
      steps {
        sh 'docker compose build e2e-runner'
        sh 'docker compose up --abort-on-container-exit e2e-runner'
      }
    }
    stage('Archive coverage') {
      steps {
        archiveArtifacts artifacts: 'output/**/*.json', fingerprint: true
      }
      post {
        always {
          sh 'docker compose down -v'
        }
      }
    }
  }
}