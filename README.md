# Pocket AI
(Description WIP)


## Start Your Local UI Development Environment

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