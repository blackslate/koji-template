/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// This function runs when the Game Screen is ON
function gamePlay() {
  // Draw background
  if (imgBackgroundInGame) {
    background(Koji.config.colors.backgroundColor) // To overlay the Starting Screen
    background(imgBackgroundInGame)
  } else {
    background(Koji.config.colors.backgroundColor)
  }

  // Draw Timer! (Comment this blob of code if you don't want timer)
  if (Koji.config.strings.enableTimer && gameTimerEnabled) {
    gameTimer -= 1 / frameRate()
    drawTimer()
  }

  // InGame UI
  clouds.forEach(cloud => {
    cloud.show()
    !personBusted && cloud.update()

    if (cloud.wentOutOfFrame()) {
      cloud.removable = true
    }
  })

  // Floating Text effects
  for (let i = 0; i < floatingTexts.length; i += 1) {
    floatingTexts[i].update()
    floatingTexts[i].render()
  }

  // Particle effects
  for (let i = 0; i < particles.length; i += 1) {
    if (particles[i]) {
      particles[i].render()
      particles[i].update()
    }
  }

  coinsAndObstacles.forEach(entity => {
    entity.show()
    !personBusted && entity.update()

    if (entity.settings.type === 'obstacle') entity.rotate(undefined)

    if (entity.wentOutOfFrame()) {
      entity.removable = true
    }
  })

  fallingPerson.show()

  if (!personBusted)
    fallingPerson.body.position.x += isMobileSize
      ? Smooth(0, 10, 1) * fallingPerson.moveDir
      : Smooth(0, 10, 0.75) * fallingPerson.moveDir

  if (!personBusted && fallingPerson.body.position.y <= height * 0.25) {
    fallingPerson.body.position.y = Ease(
      EasingFunctions.easeInCubic,
      1,
      fallingPerson.body.position.y,
      height * 0.25,
      3
    )
  }

  if (keyIsPressed) {
    // move by keys on desktop
    if (keyCode === LEFT_ARROW || key === 'a') {
      if (fallingPerson.wentOutOfFrame()) {
        fallingPerson.body.position.x = width
      }
    }

    if (keyCode === RIGHT_ARROW || key === 'd') {
      if (fallingPerson.wentOutOfFrame()) {
        fallingPerson.body.position.x = 0
      }
    }
  }

  if (gameStart && !personBusted) {
    // cameraMovementSpeed += 0.0007

    // start spawing coins, obstacles and clouds
    spawnTimer += 1 / frameRate()
    if (spawnTimer >= 0.4) {
      clouds.push(
        new MovingEntity(
          {
            x: random(0, width),
            y: height + height * 0.1,
          },
          {
            width: random(objSize * 6, objSize * 8),
            height: random(objSize * 4, objSize * 6),
          },
          { image: imgCloud, shape: 'rectangle', type: 'cloud' }
        )
      )

      const entityType = random(entityTypes)
      const entitySize =
        entityType.typeName === 'obstacle' ? objSize * 4 : objSize * 3
      coinsAndObstacles.push(
        new MovingEntity(
          {
            x: random(0, width),
            y: height + height * 0.1,
          },
          {
            width: isMobileSize ? entitySize * 0.75 : entitySize,
            height: isMobileSize ? entitySize * 0.75 : entitySize,
            radius: isMobileSize ? (entitySize * 0.75) / 2 : entitySize / 2,
          },
          {
            image: entityType.image,
            shape: 'circle',
            type: entityType.typeName,
            rotate: true,
          }
        )
      )

      spawnTimer = 0
    }
  }

  // Handle Collision!
  coinsAndObstacles.forEach(entity => {
    // Falling person to Coins
    if (
      entity.settings.type === 'coin' &&
      fallingPerson.didTouch(
        {
          sizing: entity.sizing,
          body: entity.body,
        },
        'circle'
      )
    ) {
      entity.removable = true
      addScore(
        1,
        imgCoin,
        {
          x: entity.body.position.x,
          y: entity.body.position.y - entity.sizing.radius / 2,
        },
        10,
        { floatingText: true }
      )
    }

    // Falling person to Obstacles
    if (
      entity.settings.type === 'obstacle' &&
      fallingPerson.didTouch(
        {
          sizing: entity.sizing,
          body: entity.body,
        },
        'circle'
      )
    ) {
      particlesEffect(
        imgFallingPerson,
        { x: fallingPerson.body.position.x, y: fallingPerson.body.position.y },
        isMobile ? 10 : 20
      )

      fallingPerson.body.position.y = 0 - height * 0.2
      fallingPerson.body.position.x = random(0, width)

      if (lives === 1) {
        setTimeout(loseLife, 1000)
      } else {
        loseLife()
      }

      personBusted = true
    }
  })

  // Score draw
  const scoreX = width - objSize / 2
  const scoreY = objSize / 3
  textSize(objSize * 2)
  fill(Koji.config.colors.scoreColor)
  textAlign(RIGHT, TOP)
  text(score, scoreX, scoreY)

  // Lives draw
  const lifeSize = objSize * 1.5
  for (let i = 0; i < lives; i += 1) {
    image(
      imgLife,
      lifeSize / 2 + lifeSize * i * 1.2,
      lifeSize / 2,
      lifeSize,
      lifeSize
    )
  }

  cleanup()
}
