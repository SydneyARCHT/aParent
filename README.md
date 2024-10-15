# aParent EdTech Application

## Synopsis & Purpose

The aParent EdTech Application was created in accordance with the Co.Lab 
Product Sprint Bootcamp that allows for tech new-comers to get experience working asynchronously with 
a team of people from all over the world in different disciplines such 
as designer, product manager and software engineer.

aParent was built with the problem statement in mind of increasing ease of communication between teacher & parent about the academic performance and behavioral development of their students, and children respectively.

(Note: This Application Is currently only functional for the parent end of the 2 sided solution.)

## Installation & Setup

- Clone The repository into a folder of your choice
    - Inside your preffered directory folder run the following commands: 
        \`\`\`
        git clone https://github.com/SydneyARCHT/aParent.git
        cd aParent
        npm install
        \`\`\`

- Install The Backend Dependencies
    \`\`\`
    cd node_backend
    npm install
    \`\`\`

- Once Dependencies have been installed in either the Apple App Store or the Google Play Store install "Expo Go"

- Then Head back to your command line and create 2 seperate terminals:
  - 1. Inside the root directory, `your-folder/aparent` run: `npm start`
  - 2. Then Create a second terminal inside the `your-folder/aparent/node_backend` directory and run `node index.js`
  
- Once the Server is running and the Metro Bundler finishes bundling the JavaScript it will display a QR Code, if on Iphone, scan this code using the camera app, if on android scan this application utilizing the Expo Go App

- Once the app has loaded, You may either register a new account or log into the test account for populated data using the `blake@outlook.com` as the email and `home123` as the password and Voila! You now should have full access to the parent side of the application!


## The Dream Team

The Team responsible for the development of the application is as Follows;

#### - Designer: Nevin Winter

#### - Product Manager: Tham Lam Pham

#### - Backend Developer: Blake McGuire

#### - Frontend Developer: Sydney Stiward

## Tech Stack

### Frontend Framework

The Frontend Framework used for this application is React Native and for styling we utilized React Native Paper.

### Backend Framework

For the Backend we utilized Node.js, Express and Firebase for the data base

#### Dependencies 

For a deeper insight into all of the dependencies utilized for the development of this application you may view a full list inside the `package.json` file inside the aparent root directory.


