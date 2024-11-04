# Do código ao Ambiente de Produção

Este repositório foi criado para ajudar na criação de GitHub Actions com foco em APIs. Ele fornece um exemplo prático de como configurar e utilizar diversas tecnologias para construir, testar e implantar uma API de forma eficiente.

Aqui você verá como automatizar processos como a criação de testes automatizados, configuração de um ambiente de integração contínua (CI) e a implantação em um ambiente de produção.

## Tecnologias Utilizadas

- **[Node.js](https://nodejs.org/)**: Ambiente de execução JavaScript no lado do servidor.
- **[PostgreSQL](https://www.postgresql.org/)**: Sistema de gerenciamento de banco de dados relacional de código aberto.
- **[Express](https://expressjs.com/)**: Framework web para Node.js, utilizado para construir a API.
- **[Prisma](https://www.prisma.io/)**: ORM (Object-Relational Mapping) para interagir com o banco de dados PostgreSQL.
- **[Supabase](https://supabase.com/)**: Serviço de banco de dados utilizado neste projeto.
- **[GitHub Actions](https://github.com/features/actions)**: Plataforma de CI/CD para automação de fluxos de trabalho.
- **[Docker](https://www.docker.com/)**: Plataforma de código aberto para construir, enviar e executar aplicativos em contêineres.
- **[Jest](https://jestjs.io/)**: Framework de testes em JavaScript.
- **[Logger](https://github.com/PedroFnseca/logger-endpoints-api)** : Logger para monitoramento de requisições. (Desenvolvido por mim)

## Banco de Dados

Este projeto utiliza o [Supabase](https://supabase.com/) como serviço de banco de dados e o [Prisma](https://www.prisma.io/) como ORM (Object-Relational Mapping) para interagir com o banco de dados PostgreSQL.

### Esquema do Banco de Dados

Abaixo está o esquema do banco de dados utilizado neste projeto:

| Nome       | Descrição                | Tipo      | Regras                          |
|------------|--------------------------|-----------|---------------------------------|
| id         | Identificador único      | Int       | @id @default(autoincrement())   |
| createdAt  | Data de criação          | DateTime  | @default(now())                 |
| updatedAt  | Data de atualização      | DateTime  | @updatedAt                      |
| name       | Nome do usuário          | String    |                                 |
| email      | Email do usuário         | String    | @unique   

--- 

## Automatização de Testes
> Este projeto utiliza o GitHub Actions para automação de fluxos de trabalho de CI/CD. Abaixo está a configuração da action que roda a suíte de testes em cada Pull Request.

[Arquivo](.github/workflows/test-on-pr.yaml) de configuração da action:
```yaml
name: Test on Pull Request

on:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm install

    - name: Run tests
      run: npm test
```

1. executa em uma máquina virtual do GitHub com o sistema operacional Ubuntu.
2. verifica o código do repositório.
3. configura o ambiente Node.js.
4. instala as dependências do projeto.
5. executa a suíte de testes com o comando `npm test`.

**Obs**: É possivel configurar o GitHub Actions poder recusar Pull Requests que não passarem nos testes. Utilizando da configuração de branchs protegidas. [Saiba mais](https://docs.github.com/pt/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-deployments-to-succeed-before-merging)

---

## Automatização de releases
> O release basicamente é a versão do software que será disponibilizada para os usuários. Você pode utilizar para criar um apk de uma aplicação mobile, um executável de uma aplicação desktop ou um pacote de uma aplicação web, por exemplo.

[Arquivo](.github/workflows/release.yaml) de configuração da action:
```yaml
name: Create Release

on:
  push:
    branches:
      - main

permissions:
  contents: write

jobs:
  release:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm install

    - name: Get version from package.json
      id: get_version
      run: |
        VERSION=$(node -p -e "require('./package.json').version")
        echo "VERSION=$VERSION" >> $GITHUB_ENV

    - name: Create GitHub Release
      id: create_release
      uses: actions/create-release@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        tag_name: v${{ steps.get_version.outputs.VERSION }}
        release_name: Release v${{ steps.get_version.outputs.VERSION }}
        draft: false
        prerelease: false
```

1. executa em uma máquina virtual do GitHub com o sistema operacional Ubuntu.
2. verifica o código do repositório.
3. configura o ambiente Node.js.
4. instala as dependências do projeto.
5. obtém a versão do projeto a partir do arquivo `package.json`.
6. cria um release no GitHub com a versão obtida.

---

## Implantação em Ambiente de Produção (Azure web app)
> O Azure Web Apps é um serviço de hospedagem de aplicativos da Web totalmente gerenciado que permite que você crie e hospede aplicativos da Web, aplicativos móveis, APIs RESTful e back-ends de API em várias linguagens de programação, como .NET, .NET Core, Node.js, Java, PHP e Python.

[Arquivo](.github/workflows/deploy-to-azure.yaml) de configuração da action:
```yaml
name: Build and deploy Node.js app to Azure Web App - nodejs-action

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js version
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'

      - name: npm install, build, and test
        run: |
          npm install
          npm run build --if-present
          npm run test --if-present

      - name: Zip artifact for deployment
        run: zip release.zip ./* -r

      - name: Upload artifact for deployment job
        uses: actions/upload-artifact@v4
        with:
          name: node-app
          path: release.zip

  deploy:
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: 'Production'
      url: ${{ steps.deploy-to-webapp.outputs.webapp-url }}
    
    steps:
      - name: Download artifact from build job
        uses: actions/download-artifact@v4
        with:
          name: node-app

      - name: Unzip artifact for deployment
        run: unzip release.zip
      
      - name: 'Deploy to Azure Web App'
        id: deploy-to-webapp
        uses: azure/webapps-deploy@v3
        with:
          app-name: 'nodejs-action'
          slot-name: 'Production'
          package: .
          publish-profile: ${{ secrets.AZUREAPPSERVICE_PUBLISHPROFILE_F645E14404DD4F59B162C90420888ADC }}
```

1. executa em uma máquina virtual do GitHub com o sistema operacional Ubuntu.
2. verifica o código do repositório.
3. configura o ambiente Node.js.
4. instala as dependências do projeto.
5. cria um arquivo zip com o código do projeto.
6. faz o upload do arquivo zip para o GitHub Actions.
7. baixa o arquivo zip do GitHub Actions.
8. descompacta o arquivo zip.
9. implanta o código no Azure Web App.

---

## Bonus: Geração de apk react-native
> O React Native é uma biblioteca que permite o desenvolvimento de aplicativos móveis multiplataforma usando JavaScript e React. Com ele, é possível criar aplicativos para Android e iOS com uma única base de código.

```yaml
name: Create Release on Push to Main

on:
  push:
    branches:
      - main

jobs:
  create-release:
    runs-on: ubuntu-latest

    permissions:
      contents: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install --legacy-peer-deps

      - name: Install React Native CLI
        run: npm install -g react-native-cli

      - name: Create assets directory
        run: mkdir -p android/app/src/main/assets

      - name: Bundle React Native code and assets
        run: react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Grant execute permission for gradlew
        run: chmod +x android/gradlew

      - name: Build APK
        run: |
          cd android
          ./gradlew assembleRelease

      - name: Create Release
        id: create_release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ github.run_number }}
          release_name: Release ${{ github.run_number }}
          draft: false
          prerelease: false

      - name: Upload Release Asset
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: android/app/build/outputs/apk/release/app-release.apk
          asset_name: app-release.apk
          asset_content_type: application/vnd.android.package-archive
```

1. executa em uma máquina virtual do GitHub com o sistema operacional Ubuntu.
2. verifica o código do repositório.
3. configura o ambiente Node.js.
4. instala as dependências do projeto.
5. instala o React Native CLI.
6. cria um diretório para os assets do aplicativo.
7. gera o bundle do código e dos assets do React Native.
8. configura o JDK 17.
9. concede permissão de execução para o gradlew.
10. constrói o APK do aplicativo.
11. cria um release no GitHub.
12. faz o upload do APK gerado para o release criado.
