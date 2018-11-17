const previousResponseNodes = {};

module.exports = (ector, user, entry) => {
    ector.setUser(user);
    ector.linkNodesToLastSentence(previousResponseNodes[user]);
    ector.addEntry(entry);
    const response = ector.generateResponse();
    previousResponseNodes[user] = response.nodes;
    return response;
};