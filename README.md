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

## Loading Screen

The app opens with a Loading screen which shows a throbber while assets are downloaded. You can set the minimum and (suggested)
maximum time to display the Splash screen in `.koji/customization/assets.json`. If preloading takes so long that the maximum time is
exceeded, then the game will start anyway, but certain assets may not
yet be available.

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

The Achievements VCC asks you to provide a `key` for each trophy. The Achievements.js should contain a method to match each `key`. There are two ways that you can unlock an achievement from another script:

1. Call the method `unlockAchievement(<key>)`
2. Provide a method with the same name as the key, and draw on the data held in `this.state` to determine whether the achievement has been obtained or not.

You have two public methods to alter the data held in `this.state`:

 * `setStats(key, value)`
 * `incrementStats(key, increment)`

You can use `setStats()` to add any property with any value to `this.state`. You can use `incrementStats` to set any property to a numerical value. The 

## The Game Itself


## Developing locally

You can find a three-part tutorial on how to develop locally on the [Koji Documentation site](https://withkoji.com/docs/tutorials/using-git-to-manage-your-project)

