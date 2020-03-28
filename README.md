# Fork

## Meal Plan Generator
Make your weekly meal planning simpler! This application provides you with four choices per meal. Version 1 allows you to create a weekly meal plan consisting of 3 recipes per breakfast, lunch, or dinner choice, so you have a variety of meals for the week. For each meal, users will choose between a set of recipes for the specific meal. These recipes' ingredients are then compiled together to create a grocery list for reference. The application utilizes the [spoonacular api](https://spoonacular.com/food-api). It is a rich backend containing parameters to specify timeFrame, targetCalories, diet, restrictions, and images to references to cater to wellness enthusiasts' and professionals' preferences.
For version 2: I plan to implement the following:
  - save feature to save current and historic plans, utilizing OAuth for authentication
  - search feature to find specfic recipes
  - favorites feature
  - includes dietary restrictions

## Technologies
  - React.js
  - Material UI
  - Heroku
  - Postman

## Setup
  1. Fork & Clone or download this repository.
  2. Install dependencies with npm install.
  3. Run local client with npm run start.

## User Stories - As a user, I would like to...
  1. plan 3 sets of 3 daily meals categorized as breakfast, lunch, and dinner.
  2. have 12 choices drawn at random from the api of which I can choose 3 per meal category.
  3. create a grocery list based off of the 9 recipes I selected for the plans.
