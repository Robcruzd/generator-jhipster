/**
 * Copyright 2013-2023 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import chalk from 'chalk';

export default {
  askPipeline,
  askIntegrations,
};

async function askPipeline() {
  if (this.abort) return;
  if (this.autoconfigureTravis) {
    this.logger.info('Auto-configuring Travis CI');
    this.pipeline = 'travis';
    return;
  }
  if (this.autoconfigureJenkins) {
    this.logger.info('Auto-configuring Jenkins');
    this.pipeline = 'jenkinsscp';
    this.sendBuildToGitlab = false;
    this.insideDocker = false;
    return;
  }

  if (this.autoconfigureGitlab) {
    this.logger.info('Auto-configuring Gitlab');
    this.pipeline = 'gitlab';
    this.sendBuildToGitlab = true;
    this.insideDocker = true;
    return;
  }

  if (this.autoconfigureAzure) {
    this.logger.info('Auto-configuring Azure');
    this.pipeline = 'azure';
    return;
  }

  if (this.autoconfigureGithub) {
    this.logger.info('Auto-configuring GitHub Actions');
    this.pipeline = 'github';
    return;
  }

  if (this.autoconfigureCircleCI) {
    this.logger.info('Auto-configuring CircleCI');
    this.pipeline = 'circle';
    return;
  }

  const prompts = [
    {
      type: 'list',
      name: 'pipeline',
      message: 'What CI/CD pipeline do you want to generate?',
      default: 'jenkinsdec',
      choices: [
        { name: 'Jenkins declarative pipeline', value: 'jenkinsdec' },
        { name: 'Jenkins scripted pipeline', value: 'jenkinsscp' },
        { name: 'Azure Pipelines', value: 'azure' },
        { name: 'GitLab CI', value: 'gitlab' },
        { name: 'GitHub Actions', value: 'github' },
        { name: 'Travis CI', value: 'travis' },
        { name: 'CircleCI', value: 'circle' },
      ],
    },
  ];
  const props = await this.prompt(prompts);
  this.pipeline = props.pipeline;
}

async function askIntegrations() {
  if (this.abort || !this.pipeline) return;
  if (this.autoconfigureTravis) {
    this.cicdIntegrations = [];
    return;
  }
  if (this.autoconfigureJenkins) {
    this.cicdIntegrations = [];
    this.sendBuildToGitlab = false;
    this.insideDocker = true;
    return;
  }

  if (this.autoconfigureGitlab) {
    this.cicdIntegrations = [];
    this.sendBuildToGitlab = true;
    this.insideDocker = true;
    return;
  }

  if (this.autoconfigureAzure) {
    this.logger.info('Auto-configuring Azure');
    this.pipeline = 'azure';
    return;
  }

  if (this.autoconfigureGithub) {
    this.logger.info('Auto-configuring GitHub Actions');
    this.pipeline = 'github';
    return;
  }

  if (this.autoconfigureCircleCI) {
    this.logger.info('Auto-configuring CircleCI');
    this.pipeline = 'circle';
    return;
  }


  const integrationChoices = [];
  if (['jenkinsscp', 'gitlab', 'travis', 'github', 'circle', 'azure'].includes(this.pipeline)) {
      integrationChoices.push({
        name: `${chalk.yellow('*Snyk*')}: dependency scanning for security vulnerabilities (requires SNYK_TOKEN)`,
        value: 'snyk',
      });
    }
  if (['jenkinsscp', 'gitlab', 'travis', 'github'].includes(this.pipeline)) {
    integrationChoices.push({ name: `Analyze your code with ${chalk.yellow('*Sonar*')}`, value: 'sonar' });
  }
  if (['jenkinsscp', 'jenkins', 'gitlab', 'travis', 'github', 'circle'].includes(this.pipeline)) {
    integrationChoices.push({
      name: `Add deliver and deploy to the pipeline`,
      value: 'deliverDeploy'
    })
  } else {
    integrationChoices.push({
      name: `Add deliver and deploy on Azure services to the pipeline`,
      value: 'deliverDeployAz'
    })
  }


  // if (['jenkinsscp', 'gitlab'].includes(this.pipeline)) {
  //   integrationChoices.push({ name: `Deploy your application to an ${chalk.yellow('*Artifactory*')}`, value: 'deploy' });
  // }
  
  // if (['jenkinsscp', 'github'].includes(this.pipeline)) {
  //   integrationChoices.push({ name: `Build and publish a ${chalk.yellow('*Docker*')} image`, value: 'publishDocker' });
  // }
  // if (['jenkinsscp', 'gitlab', 'travis', 'github', 'circle'].includes(this.pipeline)) {
  //   integrationChoices.push({
  //     name: `Deploy to ${chalk.yellow('*Heroku*')} (requires HEROKU_API_KEY set on CI service)`,
  //     value: 'heroku',
  //   });
  // }
  if (['github'].includes(this.pipeline)) {
    integrationChoices.push({
      name: `Would you like to enable the ${chalk.yellow(
        '*Cypress Dashboard*'
      )} (requires both CYPRESS_PROJECT_ID and CYPRESS_RECORD_KEY set on CI service)`,
      value: 'cypressDashboard',
    });
  }
  const defaultDockerImage = `jhipster/${this.dasherizedBaseName}`;

  const prompts = [
    // {
    //   when: this.pipeline === 'jenkinsscp',
    //   type: 'confirm',
    //   name: 'insideDocker',
    //   message: 'Would you like to perform the build in a Docker container ?',
    //   default: false,
    // },
    // {
    //   when: this.pipeline === 'gitlab',
    //   type: 'confirm',
    //   name: 'insideDocker',
    //   message: 'In GitLab CI, perform the build in a docker container (hint: GitLab.com uses Docker container) ?',
    //   default: false,
    // },
    {
      when: this.pipeline === 'jenkinsscp',
      type: 'confirm',
      name: 'sendBuildToGitlab',
      message: 'Would you like to send build status to GitLab ?',
      default: false,
    },
    {
      when: integrationChoices.length > 0,
      type: 'checkbox',
      name: 'cicdIntegrations',
      message: 'What tasks/integrations do you want to include ?',
      default: [],
      choices: integrationChoices,
    },
    {
      when: response => ['jenkinsscp', 'jenkins', 'gitlab'].includes(this.pipeline) && response.cicdIntegrations.includes('deliverDeploy'),
      type: 'list',
      name: 'deliverTool',
      message: 'Where do you want to deliver or deploy the app?',
      default: 'azure',
      choices: [
        { name: 'Azure: Deliver and/or deploy with azure services', value: 'azure' },
        { name: `Artifactory: Only deliver your application to an ${chalk.yellow('*Artifactory*')}`, value: 'artifactory'},
        { name: 'Heroku: Deliver your application to an Artifactory and deploy on Heroku', value: 'heroku'}
      ]
    },
    {
      when: response => ['jenkinsscp', 'jenkins', 'gitlab', 'travis', 'github', 'circle'].includes(this.pipeline) && response.cicdIntegrations.includes('deliverDeploy'),
      type: 'list',
      name: 'deliverTool',
      message: 'Where do you want to deliver or deploy the app?',
      default: 'azure',
      choices: [
        { name: 'Azure: Deliver and/or deploy with azure services', value: 'azure' },
        { name: `Artifactory: Only deliver your application to an ${chalk.yellow('*Artifactory*')}`, value: 'artifactory'}
      ]
    },
    {
      when: response => response.deliverTool && (response.deliverTool.includes('artifactory') || response.deliverTool.includes('heroku')),
      type: 'input',
      name: 'artifactorySnapshotsId',
      message: `${chalk.yellow('*Artifactory*')}: what is the ID of distributionManagement for snapshots ?`,
      default: 'snapshots',
    },
    {
      when: response => response.deliverTool && (response.deliverTool.includes('artifactory') || response.deliverTool.includes('heroku')),
      type: 'input',
      name: 'artifactorySnapshotsUrl',
      message: `${chalk.yellow('*Artifactory*')}: what is the URL of distributionManagement for snapshots ?`,
      default: 'http://artifactory:8081/artifactory/libs-snapshot',
    },
    {
      when: response => response.deliverTool && (response.deliverTool.includes('artifactory') || response.deliverTool.includes('heroku')),
      type: 'input',
      name: 'artifactoryReleasesId',
      message: `${chalk.yellow('*Artifactory*')}: what is the ID of distributionManagement for releases ?`,
      default: 'releases',
    },
    {
      when: response => response.deliverTool && (response.deliverTool.includes('artifactory') || response.deliverTool.includes('heroku')),
      type: 'input',
      name: 'artifactoryReleasesUrl',
      message: `${chalk.yellow('*Artifactory*')}: what is the URL of distributionManagement for releases ?`,
      default: 'http://artifactory:8081/artifactory/libs-release',
    },
    {
      when: response => response.deliverTool && response.deliverTool.includes('heroku'),
      type: 'input',
      name: 'herokuAppName',
      message: `${chalk.yellow('*Heroku*')}: name of your Heroku Application ?`,
      default: `${this.herokuAppName}`,
    },
    {
      when: response => (response.deliverTool && response.deliverTool.includes('azure'))  || (response.cicdIntegrations && response.cicdIntegrations.includes('deliverDeployAz')),
      type: 'list',
      name: 'azure',
      message: 'What steps do you want to add to the pipeline?',
      default: 'deliver',
      choices: [
        { name: 'only deliver', value: 'deliver' },
        { name: 'deliver and deploy', value: 'deploy'}
      ]
    },
    {
      when: response => response.azure && response.azure.includes('deliver'),
      type: 'list',
      name: 'deliver',
      message: 'How do you want to deliver de application?',
      default: 'docker',
      choices: [
        { name: 'Docker Image in Azure Container Registry', value: 'docker' },
        { name: 'Jar file in the pipeline tool', value: 'jar'}
      ]
    },
    {
      when: response => response.azure && response.azure.includes('deploy'),
      type: 'list',
      name: 'deployService',
      message: 'Where do you want to deploy de application?',
      default: 'azws',
      choices: [
        { name: 'Azure Web Service', value: 'azws'},
        { name: 'Azure Kubernetes Service', value: 'aks' },
        { name: 'Azure Web Service for Containers', value: 'azwsc'}
      ]
    },
    {
      when: response => this.pipeline === 'jenkinsscp' && response.cicdIntegrations.includes('sonar'),
      type: 'input',
      name: 'sonarName',
      message: `${chalk.yellow('*Sonar*')}: what is the name of the Sonar server ?`,
      default: 'sonar',
    },
    {
      when: response => this.pipeline !== 'jenkinsscp' && response.cicdIntegrations.includes('sonar'),
      type: 'input',
      name: 'sonarUrl',
      message: `${chalk.yellow('*Sonar*')}: what is the URL of the Sonar server ?`,
      default: 'https://sonarcloud.io',
    },
    {
      when: response => this.pipeline !== 'jenkinsscp' && response.cicdIntegrations.includes('sonar'),
      type: 'input',
      name: 'sonarOrga',
      message: `${chalk.yellow('*Sonar*')}: what is the Organization of the Sonar server ?`,
      default: '',
    },
    // {
    //   when: response => this.pipeline === 'github' && response.cicdIntegrations.includes('publishDocker'),
    //   type: 'input',
    //   name: 'dockerImage',
    //   message: `${chalk.yellow('*Docker*')}: what is the name of the image ?`,
    //   default: defaultDockerImage,
    // },
    
  ];
  const props = await this.prompt(prompts);

  this.cicdIntegrations = props.cicdIntegrations;
  this.propsPrompt = props;

  this.artifactorySnapshotsId = props.artifactorySnapshotsId;
  this.artifactorySnapshotsUrl = props.artifactorySnapshotsUrl;
  this.artifactoryReleasesId = props.artifactoryReleasesId;
  this.artifactoryReleasesUrl = props.artifactoryReleasesUrl;

  this.sonarName = props.sonarName;
  this.sonarUrl = props.sonarUrl;
  this.sonarOrga = props.sonarOrga;

  this.publishDocker = props.publishDocker;
  this.dockerImage = props.dockerImage;

  this.insideDocker = props.insideDocker;

  this.sendBuildToGitlab = props.sendBuildToGitlab;
}
