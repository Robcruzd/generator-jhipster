# Proyecto basado en JHipster 7.9.3 con mejoras en generador de pipelines de CI/CD

## Descripción

Este proyecto se basa en [JHipster](https://www.jhipster.tech/) en su versión 7.9.3, y el generador de pipelines de CI/CD de que este posee en esa versión. A partir de este, se implementaron mejoras en el generador de pipelines, ajustando las opciones de entrega continua y despliegue en servicios de Azure, tales como:

- **Azure App Service**
- **Azure App Service for Containers**
- **Azure Kubernetes Service (AKS)**

Las mejoras permiten una mayor flexibilidad en los pipelines y optimizan el flujo de trabajo de despliegue para entornos en la nube.
Adicionalmente las herramientas de CI/CD con las que cuenta el generador son:

- Azure Pipelines
- Circle CI
- Github Actions
- Gitlab CI
- Jenkins
- Travis CI

## Características principales

- **Generador de CI/CD de JHipster**: Modificado para soportar configuraciones específicas de entrega continua y despliegue en Azure.
- **Integración con Azure**: Pipelines ajustados para una integración más fluida con los servicios de Azure.
- **Soporte para Azure App Service y AKS**: Despliegue directo en contenedores y clústeres de Kubernetes alojados en Azure.
- **Flexibilidad en la configuración de entrega continua**: Opciones ajustadas para soportar despliegues automáticos y manuales según las necesidades del proyecto.

## Requisitos previos

- [JHipster](https://www.jhipster.tech/) versión 7.9.3 (usar la del presente repositorio).
- [Node.js](https://nodejs.org/) (se recomienda versión 16.17.0) y [NPM](https://www.npmjs.com/) (se recomienda versión 8.15.0).
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) para la interacción con servicios de Azure para herramientas de ci-cd local como jenkins.
- Cuenta en [Azure](https://azure.microsoft.com/) con los siguientes servicios habilitados:
  - Azure Container Registry
  - App Service
  - App Service for Containers
  - AKS (Azure Kubernetes Service)

## Instalación y configuración

1. **Clonar el repositorio**:
   ```bash
   git clone [https://github.com/Robcruzd/generator-jhipster.git](https://github.com/Robcruzd/generator-jhipster.git)
   cd generator-jhipster
   
2. **Configurar Jhipster**:
   ```bash
   npm ci
   npm link
3. **Crear proyecto de Jhipster**:
   ```bash
   cd ..
   mkdir <nombre proyecto>
   cd <nombre proyecto>
   jhipster
   ```
   Se sugiere seleccionar un proyecto monolito, ya que este fue el proyecto base para su desarrollo.
4. **Crear pipeline en el proyecto**:
   Luego de haber creado el proyecto y dentro del mismo, se debe ejecutar el siguiente comando y seleccionar las opciones deseadas para crear el pipeline.
   ```bash
   jhipster ci-cd
   ```
   Dependiendo de las herramientas seleccionadas se generará el pipeline en la siguiente ubicación:

- Azure Pipelines: .azure-pipelines.yml
- Circle CI: .circleci/config.yml
- Github Actions: .github/workflows/main.yml
- Gitlab CI: .gitlab-ci.yml
- Jenkins: .Jenkinsfile
- Travis CI: .travis.yml
