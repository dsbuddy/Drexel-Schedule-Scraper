# Drexel-Schedule-Helper
A project that intends to help Drexel students plan out their schedules for classes.

# Required software
* Node.JS
* npm
* MySQL server

# How to run this code
We are using a heroku instance to run this app, which can be found at [scheduleboy.herokuapp.com](http://scheduleboy.herokuapp.com). If you want to run it locally, you can run `npm install` to install all the required packages. Then run `node server.js` to run the server code and go to `localhost:8080` in your browser.

# How to use the app
First, click on Create Schedule. This will take you to a page where you can select what term you want to schedule for. Next, enter all the classes you want to take this term, which can be auto-completed. Enter any restrictions you want, such as no class on Friday, or no classes after 5:00PM. Finally, click Find Schedules and our app will find all the possible schedules for that you can take with those classes. It may take a little while if there are a lot of sections for each class.
