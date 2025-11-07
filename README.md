# Pocket AI
(Description WIP)


## Start Your Local UI Development Environment

### Option 1: Using Docker (Recommended for Team Consistency)

Docker provides a consistent development environment across all team members, regardless of their operating system.

**Prerequisites:**
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)

**Steps:**

1. Build and start the Docker container:
```bash
docker-compose up --build
```

2. Access the Expo development server at http://localhost:19000

3. To run in the background:
```bash
docker-compose up -d
```

4. To stop the container:
```bash
docker-compose down
```

5. To view logs:
```bash
docker-compose logs -f ui
```

**Note:** All source code changes are automatically synced to the container, so you can edit files on your local machine and see changes reflected immediately.

### Option 2: Local Setup (Without Docker)

This project uses React Native for the front end. 
To run your project, navigate to the directory:

`cd src/UI`

Make sure that you have npm installed: Run the command:

`npm -v`

You should see the version number printed in the console, if not, follow [this tutorial to install npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) 

Install dependencies:

`npm install`

Run one of the following npm commands:

- `npm run android`
- `npm run ios`
- `npm run web`

### Troubleshooting
#### Mac
```
Unable to boot device because we cannot determine the runtime bundle.
No such file or directory
```
Make sure you've opened Simulator

```
Unable to run simctl:
Error: xcrun simctl help exited with non-zero code: 72
```

1. Xcode Command Line Tools aren’t installed

Try: `xcode-select --install`

Then retry: `xcrun simctl list`

2. xcode-select is pointing to the wrong Xcode path

Maybe you installed or removed Xcode recently. Check the current developer directory:

`xcode-select -p`

It should point to something like:

`/Applications/Xcode.app/Contents/Developer`

If it doesn’t, fix it with:

`sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`

#### Windows
Feel free to add your troubleshooting tips on Windows here