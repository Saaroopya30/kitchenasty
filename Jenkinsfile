pipeline {
  agent any
  stages {
    stage('Build and run e2e with coverage') {
      steps {
        sh 'docker compose down -v --remove-orphans || true'
        sh 'docker compose build e2e-runner'
        script {
          def testExitCode = sh(script: 'docker compose up --abort-on-container-exit e2e-runner', returnStatus: true)
          if (testExitCode != 0) {
            unstable("Playwright tests failed (exit code ${testExitCode}) — coverage will still be archived")
          }
        }
        sh 'docker compose cp e2e-runner:/app/output ./output'
      }
    }
    stage('Archive coverage') {
      steps {
        archiveArtifacts artifacts: 'output/**/*.json', fingerprint: true
      }
      post {
        always {
          sh 'docker compose down -v --remove-orphans || true'
        }
      }
    }
  }
}