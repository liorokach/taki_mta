const userList = {};
const userGamesList = {};

function userAuthentication(req, res, next) {
  if (userList[req.session.id] === undefined) {
    res.sendStatus(401);
  } else {
    res.locals.user = userList[req.session.id];
    next();
  }
}

function addUserToAuthList(req, res, next) {
  if (userList[req.session.id] !== undefined) {
    res.status(403).send({ error: 'user already exist' });
  } else if (!req.body) {
    res.status(402).send({ error: 'enter name please' });
  } else {
    for (sessionid in userList) {
      const name = userList[sessionid];
      if (name === req.body) {
        res.status(403).send({ error: 'user name already exist' });
        return;
      }
    }
    userList[req.session.id] = req.body;
    next();
  }
}

function removeUserFromAuthList(req, res, next) {
  if (userList[req.session.id] === undefined) {
    res.status(403).send('user does not exist');
  } else {
    delete userList[req.session.id];
    next();
  }
}

function getUserInfo(id) {
  return { name: userList[id] };
}

function addGame(gameName, id) {
  userGamesList[id] = gameName;
  return { game: userGamesList[id] };
}

function getGame(id) {
  return { game: userGamesList[id] };
}

function deleteGame(id) {
  delete userGamesList[id];
  return;
}

function isEmptyGame(gameName) {
  for (sessionid in userGamesList) {
    const name = userGamesList[sessionid];
    if (name === gameName) {
      return false;
    }
  }
  return true;
}

function allUsers() {
  return { users: userList };
}

module.exports = {
  userAuthentication,
  addUserToAuthList,
  removeUserFromAuthList,
  getUserInfo,
  allUsers,
  addGame,
  getGame,
  deleteGame,
  isEmptyGame
};
