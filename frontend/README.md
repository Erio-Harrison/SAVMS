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
