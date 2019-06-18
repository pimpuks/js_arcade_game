# Classic Arcade Game Clone Project

## Table of Contents

- [Overview](#overview)
- [Running the game](#running-the-game)
- [Game functionality](#game-functionality)
- [Dependencies](#dependencies)

## Overview

This is a classic arcade game clone, implemented with HTML, CSS and Javascript based on [Udacity's assets and game engine](https://github.com/udacity/frontend-nanodegree-arcade-game).

## Running the game

Download the git repository and open the index.html file in browser or click [here](#https://pimpuks.github.io/js_arcade_game/) for github-hosted version.

## Game Functionality

In this game, there is a Player and Enemies (bugs). The goal of the player is to reach the water (i.e. be in the blue water blocks), without colliding into any one of the enemies.

- The player can move left, right, up and down using arrow keys on the keyboard
- The enemies move at varying speeds on the paved block portion of the game board
- A player has 6 lives by default. Once a the player collides with an enemy, a life is deducted and the player is moved back to the starting position.
- There are 2 random hearts for player to collect. Each heart gives an extra life.
- Once the player reaches the water (i.e., the top of the game board), the game is won. Or if the lives count is zero, the game is over.
- User can click on the restart icon on the top right-hand corner of the game to start a new game after the game is over.
- User can switch the player's character by pressing `shift` key. When the character is changed the game is reset (i.e. they player is reset to starting position, number of lives is set to 6). The character that is chosen is stored in the browser's local storage.

## Dependencies

- [Materialize CSS and Javascript](https://materializecss.com/) for Grid and Toasts pop-up message
- [jQuery](https://jquery.com/) for Materialize CSS and Javascript
- [Google fonts](https://fonts.google.com)
