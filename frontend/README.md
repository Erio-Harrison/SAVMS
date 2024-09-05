# Install

## Ubuntu

1. Install nvm:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

2. Reload the shell configuration:

```bash
source ~/.bashrc
```

3. Install the latest LTS version of Node.js:

```bash
nvm install --lts
```

4. Using the newly installed Node.js:

```bash
nvm use --lts
```

5. Add Yarn's official repository and install the latest version:

```bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update
sudo apt install yarn
```

6. Install dependency:

```bash
yarn install
```

7. Run "yarn dev" in the frontend directory to start the frontend：

```bash
yarn dev
```

## Windows

1. Download Node.js
```bash
https://nodejs.org/dist/v20.17.0/node-v20.17.0-x64.msi
```

2. Install it and test in cmd
```bash
node -v
npm -v
```

3. Switch to the local directory.
```bash
cd yourdirection\SAVMS\frontend
```

4. Run the project
```bash
npm run dev
```

5. (Optional) use yarn to run the project
```bash
yarn install
cd yourdirection\SAVMS\frontend
yarn dev
```