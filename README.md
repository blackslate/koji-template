# Leaderboard, Achievements, Settings and Credits

This scaffold provides you with a placeholder game, together with ready-built views for:

* Leaderboard
* Achievements
* Player Settings
* Credits

## View VCCs

Each of the views (Leaderboard, Achievements, Settings, Credits and the Game itself) has its own VCC. You can use these to set title, font size, colors and contents of each view. You can use the VCC at
`.koji/customization/views.json` to show or hide each of the non-Game views.

## Styling

The app uses React [styled-components](https://www.styled-components.com/) for the layout. The styles for all the views are stored together in the same file at `frontend/app/react/styles.js`.

If you are comfortable with CSS, you should be able to edit the various styles to create the look that you want for your game.

The highlighting and shading of the buttons in the Settings view is defined by the `buttonColors` method in the `frontend/utilities/utilities.js` script. If you want to generate a different effect when buttons are pressed, this is where you can make the appropriate changes.

## Loading Screen

The app opens with a Loading screen which shows a throbber while assets are downloaded. You can set the minimum and (suggested)
maximum time to display the Splash screen in `.koji/customization/assets.json`. If preloading takes so long that the maximum time is exceeded, then the game will start anyway, but certain assets may not yet be available.

To avoid a white screen while the JavaScript files are loading, the `background-color` of the &lt;body&gt; tag is set directly in the
`frontend/common/index.html` file. You might want to change this to match your app's color scheme.

## Leaderboard

### View Style

In the `.koji/customization/leaderboard.json` VCC, you can set the text for the Menu button, the view title and the colors used to display the top scores. You can also decide whether to allow your players to provide an email address.

### Code

The code for the Leaderboard can be found at `frontend/app/react/SetScore.js` and `frontend/app/react/Leaderboard.js`, but you shouldn't need to modify this. The database for the scores is stored on the Koji servers, so the leaderboard will not work without an Internet connection.

### Setting a New Score:

* From the `frontend/app/react/Game.js` script, use the following code snippet, at any time:

```js
    this.setScore(score)
````
* When the game is over, call...
```js
    this.setState({ gameOver: true })
```
... and the view will automatically switch to a Game Over screen, and then, after a delay, to the Set Score view.

## Achievements

The Achievements VCC at `.koji/customization/achievements.json` allows you to define the achievements for your own game. The code that displays the Achievements view can be found at `frontend/app/react/Achievements.js`.

The Achievements VCC asks you to provide a `key` for each trophy. The Achievements.js should contain a method to match each `key`. There are three methods that you can use to unlock an achievement, from the Game instance:

1. Call the method `achievement.unlock(<key>)`
2. Call the method `achievement.setStats(<prop>, <value>)`
3. Call the method `achievement.incrementStats(<prop>, <value>)`

The last two methods give you great flexibility on how a trophy is awarded. For example, you can count how many times a particular action is carried out, calculate the total distance travelled during 
multiple sessions, or calculate the ratio between two different statistics.

Both the `xxxStats` methods set values in the data.stats object of the Achievement instance created in `frontend/utilities/achievement.js`. 
You can use `setStats()` to add any property with any value to `data.stats`. You can use `incrementStats` to set any property to a numerical value.

To determine from these stats whether a particular achievement has been unlocked, you will need provide a method with the same name as the trophy key (as defined in the Achievements VCC), and return a true or false value from the method.

## Settings

The Settings VCC allows you to define a series of panels that will be shown in the Settings view by `frontend/app/react/Settings.js`.

You can define two kinds of settings panels:

* Selection
* Value

### Selection Settings

A Selection panel will display one or more button which can be switched on or off. You can choose from three flavours:

* **Radio buttons**: The player must choose just one from among all the possibilities. You could use such a panel to select a theme.
* **Zero or More**: The player can choose any number of items, including none at all. This is useful for non-exclusive choices like Audio and Notification settings.
* **One or More**: The player must choose at least one item, but can choose more. This could be used for example to set the number of players.

You can provide either one or two displays for each button. If you want to show a different icon or a different name for a given button when it is in its "pressed" state, simply create two entries in the Settings VCC with the same Code Name value. The first entry will define the up state, the second the down state. (If you provide more than two entries, only the first and last will be used.)

### Value Settings

A Value panel will display one or more sliders, which can produce integer values from 0 to 1000. You can set the step between values. You could use such settings to let the player choose a difficulty level, for example.

## Credits

You might want to use images or audio files created by other people, who have provided a Creative Commons license, or who request attribution or links back to their portfolio. You can use the Credits VCC to generate a series of acknowledgments that will be displayed in the Credits view. 

## The Game Itself

The gameplay in this scaffold is unimaginative. It is just a placeholder game, intended simply to provide illustrations of how to set the score for the Leaderboard and how to unlock achievements. You should replace it with home-grown code of your own.

## Developing locally

You can find a three-part tutorial on how to develop locally on the [Koji Documentation site](https://withkoji.com/docs/tutorials/using-git-to-manage-your-project)

