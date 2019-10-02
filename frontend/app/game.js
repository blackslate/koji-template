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

  // Particle effects
  for (let i = 0; i < particles.length; i += 1) {
    if (particles[i]) {
      particles[i].render()
      particles[i].update()
    }
  }

  if (personBusted) {
    bustedTimer += 1 / frameRate()
    if (bustedTimer >= 2) {
      bustedTimer = 0
      personBusted = false
    }

    if (bustedTimer >= 1) {
      clouds.forEach(cloud => {
        cloud.body.position.y = Ease(
          EasingFunctions.easeInOutQuint,
          1,
          cloud.body.position.y,
          height - height * 0.25,
          5
        )
      })

      coinsAndObstacles.forEach(entity => {
        entity.body.position.y = Ease(
          EasingFunctions.easeInOutQuint,
          1,
          entity.body.position.y,
          height - height * 0.25,
          3
        )
      })
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

  if (!personBusted && fallingPerson.body.position.y <= height * 0.25) {
    fallingPerson.body.position.y = Ease(
      EasingFunctions.easeInCubic,
      1,
      fallingPerson.body.position.y,
      height * 0.25,
      3
    )
  }

  if (!personBusted) {
    if (fallingPerson.body.position.x > width + objSize) {
      if (fallingPerson.wentOutOfFrame()) {
        fallingPerson.body.position.x = 0
      }
    }

    if (fallingPerson.body.position.x < 0 - objSize) {
      if (fallingPerson.wentOutOfFrame()) {
        fallingPerson.body.position.x = width
      }
    }
  }

  if (gameStart && !personBusted) {
    if (!isMobile) cameraMovementSpeed += 0.0005

    if (!isMobile) {
      fallingPerson.body.position.x += isMobileSize
        ? Smooth(0, 10, 1) * fallingPerson.moveDir
        : Smooth(0, 10, 0.75) * fallingPerson.moveDir
    } else {
      gameButtons.forEach(button => {
        button.update()
        button.btn.draw()
      })
      fallingPerson.body.position.x +=
        Smooth(0, 10, 1.5) * fallingPerson.moveDir
    }

    // start spawing coins, obstacles and clouds
    spawnTimer += 1 / frameRate()
    const spawnAfter = isMobile ? 0.6 : 0.4
    if (spawnTimer >= spawnAfter) {
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

      sndPickCoin.play(0, 1, 100)

      addScore(
        1,
        imgCoin,
        {
          x: entity.body.position.x,
          y: entity.body.position.y - entity.sizing.radius / 2,
        },
        isMobile ? 5 : 10,
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
        imgObstacle,
        { x: fallingPerson.body.position.x, y: fallingPerson.body.position.y },
        isMobile ? 10 : 50
      )

      floatingTexts.push(
        new OldFloatingText(
          width / 2,
          height / 2 - height * 0.01,
          Koji.config.strings.gameLostPersonText,
          Koji.config.colors.negativeFloatingTextColor,
          objSize * 1.2,
          2
        )
      )

      fallingPerson.body.position.y = 0 - height * 0.2
      fallingPerson.body.position.x = width / 2

      if (lives === 1) {
        sndLost.play(0, 1, 100)
        setTimeout(loseLife, 1000)
      } else {
        sndLostLife.play(0, 1, 100)
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

  // Floating Text effects
  for (let i = 0; i < floatingTexts.length; i += 1) {
    floatingTexts[i].update()
    floatingTexts[i].render()
  }

  cleanup()
}
