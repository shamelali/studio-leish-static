targetScope = 'resourceGroup'

// Parameters
@description('Location for resources')
param location string = resourceGroup().location

@description('Application name')
param appName string = 'empire-elites'

@description('Container image')
param imageName string = ''

@description('OpenAI API Key')
@secure()
param openAiApiKey string = ''

// Container Apps Environment
resource containerAppsEnvironment 'Microsoft.App/containerApps@2024-02-02-preview' = {
  name: '${appName}-env'
  location: location
  properties: {
    type: 'Managed'
    containerAppsConfiguration: {
      ingressConfiguration: {
        external: true
        targetPort: 8080
      }
    }
  }
}

// Container App
resource containerApp 'Microsoft.App/containerApps@2024-02-02-preview' = {
  name: appName
  location: location
  dependsOn: [containerAppsEnvironment]
  properties: {
    managedEnvironmentId: containerAppsEnvironment.id
    configuration: {
      ingress: {
        external: true
        targetPort: 8080
        transport: 'auto'
      }
      secrets: [
        {
          name: 'openai-api-key'
          value: openAiApiKey
        }
      ]
      registries: []
    }
    template: {
      containers: [
        {
          name: appName
          image: empty(imageName) ? 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest' : imageName
          resources: {
            cpu: '1.0'
            memory: '2Gi'
          }
          env: [
            {
              name: 'OPENAI_API_KEY'
              secretRef: 'openai-api-key'
            }
          ]
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 1
        rules: []
      }
    }
  }
}

// Output
output APP_URL string = 'https://${containerApp.properties.provisioningState == 'Succeeded' ? containerApp.properties.configuration.ingress.fqdn : ''}'