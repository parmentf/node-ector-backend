module.exports = (ector, user, entry) => {
    ector.setUser(user);
    const nodes = ector.addEntry(entry);
    delete ector.cns[user];
    return nodes;
};