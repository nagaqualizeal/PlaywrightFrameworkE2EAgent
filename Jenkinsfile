pipeline {
    agent any

    parameters {
        string(name: 'BRANCH_NAME', defaultValue: 'main', description: 'Branch to run')
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: "${params.BRANCH_NAME}",
                    url: 'https://github.com/nagaqualizeal/PlaywrightFrameworkE2EAgent.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install'
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    try {
                        bat 'npx playwright test'
                    } catch (err) {
                        echo "Tests failed, continuing pipeline..."
                    }
                }
            }
        }

        stage('Publish Report') {
            steps {
                script {
                    try {
                        archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
                    } catch (err) {
                        echo "Report not found, skipping..."
                    }
                }
            }
        }
    }
}