const previousResponseNodes = {};

module.exports = (ector, user, entry) => {
  ector.setUser(user);
  const nodes = ector.addEntry(entry);
  ector.linkNodesToLastSentence(previousResponseNodes[user]);
  const response = ector.generateResponse();
  previousResponseNodes[user] = response.nodes;
  return response;
};