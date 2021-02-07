function welcomeAuthorizedUser(request, response) {
  console.log(`Authorized user ${request.user.name} send GET request with JWT`);
  response.send(`Hello ${request.user.name}`);
}

module.exports = {
  welcomeAuthorizedUser,
};
